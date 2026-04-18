(function(){
  const STORAGE_KEY = 'todo_tasks_v1';
  const form = document.getElementById('task-form');
  const titleIn = document.getElementById('title');
  const categoryIn = document.getElementById('category');
  const priorityIn = document.getElementById('priority');
  const dueIn = document.getElementById('due');
  const estimateIn = document.getElementById('estimate');
  const notesIn = document.getElementById('notes');
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty');
  const search = document.getElementById('search');
  const filterCategory = document.getElementById('filter-category');
  const filterPriority = document.getElementById('filter-priority');
  const sortBy = document.getElementById('sort-by');
  const exportBtn = document.getElementById('export');
  const importBtn = document.getElementById('import');
  const importFile = document.getElementById('import-file');
  const clearBtn = document.getElementById('clear-form');

  let tasks = [];

  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

  function load(){
    try{tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch(e){tasks=[]}
  }

  function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}

  function addTask(payload){tasks.unshift(payload); save(); render();}

  function updateTask(id, data){tasks = tasks.map(t=>t.id===id?Object.assign({},t,data):t); save(); render();}

  function removeTask(id){tasks = tasks.filter(t=>t.id!==id); save(); render();}

  function toggleComplete(id){const t = tasks.find(x=>x.id===id); if(t){t.done = !t.done; t.completedAt = t.done?new Date().toISOString():null; save(); render();}}

  function formatDate(d){if(!d) return ''; const dt = new Date(d); return dt.toLocaleDateString();}

  function render(){
    list.innerHTML = '';
    const q = (search.value||'').toLowerCase();
    const fc = filterCategory.value;
    const fp = filterPriority.value;
    let out = tasks.slice();
    if(fc!=='all') out = out.filter(t=>t.category===fc);
    if(fp!=='all') out = out.filter(t=>t.priority===fp);
    if(q) out = out.filter(t=>t.title.toLowerCase().includes(q) || (t.notes||'').toLowerCase().includes(q));
    if(sortBy.value==='due') out.sort((a,b)=>{ if(!a.due) return 1; if(!b.due) return -1; return new Date(a.due)-new Date(b.due)});
    if(out.length===0){empty.style.display='block'; return}
    empty.style.display='none';
    out.forEach(t=>{
      const li = document.createElement('li'); li.className='task';
      const cb = document.createElement('div'); cb.className='checkbox'; cb.textContent = t.done ? '✓' : '';
      cb.onclick = ()=>toggleComplete(t.id);
      const content = document.createElement('div'); content.className='content';
      const h = document.createElement('div'); h.innerHTML = `<strong>${escapeHtml(t.title)}</strong>`;
      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `${escapeHtml(t.category)} • ${escapeHtml(t.priority)} ${t.due? '• Due '+formatDate(t.due):''} ${t.estimate? '• '+t.estimate+'m':''}`;
      const notes = document.createElement('div'); notes.className='small muted'; notes.textContent = t.notes||'';
      content.appendChild(h); content.appendChild(meta); if(t.notes) content.appendChild(notes);
      const actions = document.createElement('div'); actions.className='actions';
      const edit = document.createElement('button'); edit.textContent='Edit'; edit.onclick = ()=>startEdit(t.id);
      const del = document.createElement('button'); del.textContent='Delete'; del.className='alt'; del.onclick = ()=>{ if(confirm('Delete task?')) removeTask(t.id) };
      actions.appendChild(edit); actions.appendChild(del);
      li.appendChild(cb); li.appendChild(content); li.appendChild(actions);
      if(t.done) li.style.opacity = 0.6;
      list.appendChild(li);
    })
  }

  function startEdit(id){
    const t = tasks.find(x=>x.id===id); if(!t) return;
    titleIn.value = t.title; categoryIn.value = t.category; priorityIn.value = t.priority; dueIn.value = t.due? t.due.split('T')[0] : ''; estimateIn.value = t.estimate||''; notesIn.value = t.notes||'';
    form.dataset.editing = id; window.scrollTo({top:0,behavior:'smooth'});
  }

  function clearForm(){form.reset(); delete form.dataset.editing}

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = {title:titleIn.value.trim(),category:categoryIn.value,priority:priorityIn.value,due:dueIn.value||null,estimate:estimateIn.value?Number(estimateIn.value):null,notes:notesIn.value.trim()||null}
    if(form.dataset.editing){
      updateTask(form.dataset.editing,data);
      clearForm();
      return;
    }
    const payload = Object.assign({id:uid(),done:false,createdAt:new Date().toISOString()}, data);
    addTask(payload);
    clearForm();
  });

  clearBtn.addEventListener('click',clearForm);
  [search,filterCategory,filterPriority,sortBy].forEach(el=>el.addEventListener('input',render));

  exportBtn.addEventListener('click', ()=>{
    const rows = [['id','title','category','priority','due','estimate','notes','done','createdAt','completedAt']].concat(tasks.map(t=>[t.id,t.title,t.category,t.priority,t.due||'',t.estimate||'',(t.notes||'').replace(/\n/g,' '),t.done,t.createdAt,t.completedAt||'']));
    const csv = rows.map(r=>r.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='todo-export.csv'; a.click(); URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', ()=>importFile.click());
  importFile.addEventListener('change',()=>{
    const f = importFile.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = ()=>{
      const text = reader.result; const lines = text.split(/\r?\n/).filter(Boolean);
      const parsed = lines.slice(1).map(l=>{
        // naive CSV parse for exported format
        const cols = l.split(/","/).map(c=>c.replace(/^"|"$/g,''));
        return {id:cols[0],title:cols[1],category:cols[2],priority:cols[3],due:cols[4]||null,estimate:cols[5]?Number(cols[5]):null,notes:cols[6]||null,done:cols[7]==='true',createdAt:cols[8],completedAt:cols[9]||null}
      });
      tasks = parsed.concat(tasks); save(); render();
    }; reader.readAsText(f);
  });

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])}

  // init
  load(); render();
})();
