import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Trash2, Check, LogOut, Plus, Activity, Layers, Download, Search, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: token }
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Failed to fetch data');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Enter a task title');
    try {
      const res = await api.post('/tasks', { title });
      setTasks([...tasks, res.data]);
      setTitle('');
      toast.success('Task Added Successfully');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task Deleted');
    } catch (err) {
      toast.error('Delete Failed');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      const res = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      toast.error('Update Failed');
    }
  };

  const exportToCSV = () => {
    if (tasks.length === 0) {
      toast.error("No data to export!");
      return;
    }

    try {
      let csvContent = "data:text/csv;charset=utf-8,Task ID,Title,Status\n";
      
      tasks.forEach(task => {
        const safeTitle = task.title.replace(/,/g, " "); 
        csvContent += `${task._id},${safeTitle},${task.status}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Task_Report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report Downloaded");
    } catch (err) {
      toast.error("Export Error");
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  
  const chartData = [
    { name: 'Completed', value: completedCount, color: '#10b981' }, 
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },     
  ];

  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks
    .filter(task => filter === 'All' ? true : task.status === filter)
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

  const Skeleton = () => (
    <div className="animate-pulse flex items-center justify-between p-4 border border-slate-800 rounded-xl bg-slate-900/50 mb-3">
      <div className="flex items-center gap-4 w-full">
        <div className="h-6 w-6 rounded-md bg-slate-800"></div>
        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>
      
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[120px]"></div>
      </div>

      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wider">TASK<span className="text-cyan-400">MANAGER</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">Logged In As</span>
               <span className="text-sm font-mono text-cyan-400">{user?.name}</span>
             </div>
             <button onClick={logout} className="bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-400 p-2 rounded-lg transition-all cursor-pointer z-50">
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="flex justify-between items-start mb-6 relative z-50">
               <div>
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                   <Activity className="text-cyan-400" size={20} /> Dashboard Overview
                 </h2>
                 <p className="text-slate-400 text-sm mt-1">Real-time task completion status</p>
               </div>
               
               <button 
                  onClick={exportToCSV} 
                  className="relative z-50 cursor-pointer flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition-all shadow-lg active:scale-95"
               >
                 <Download size={14} /> Export Data
               </button>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
               <div className="relative flex justify-center items-center" style={{ width: 200, height: 200 }}>
                    <PieChart width={200} height={200}>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-white">{progress}%</span>
                    <span className="text-[10px] text-slate-500 uppercase">Efficiency</span>
                  </div>
               </div>
               
               <div className="flex-1 w-full grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                   <p className="text-slate-400 text-xs uppercase mb-1">Pending</p>
                   <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                   <p className="text-slate-400 text-xs uppercase mb-1">Completed</p>
                   <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
                 </div>
                 <div className="col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                   <p className="text-slate-400 text-xs uppercase mb-1">Total Tasks</p>
                   <p className="text-2xl font-bold text-white">{tasks.length}</p>
                 </div>
               </div>
             </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-purple-900/20 to-slate-900 border border-purple-500/30 p-6 rounded-2xl relative">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="text-purple-400" size={18} /> Add New Task
              </h3>
              <form onSubmit={addTask} className="relative z-20">
                <input 
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?" 
                  className="w-full bg-slate-950/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 mb-3"
                />
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
                  Add Task
                </button>
              </form>
            </motion.div>

            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl relative z-20">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-cyan-500 outline-none text-slate-300"
                />
              </div>
              <div className="flex gap-2">
                 {['All', 'Pending', 'Completed'].map(f => (
                   <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${filter === f ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                     {f}
                   </button>
                 ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-slate-400" />
          <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Your Tasks</h3>
          <div className="h-[1px] bg-slate-800 flex-1 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <motion.div className="col-span-full space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <Skeleton /><Skeleton /><Skeleton />
              </motion.div>
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <p className="text-slate-500">No tasks found matching your criteria.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <motion.div 
                  key={task._id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${task.status === 'Completed' ? 'bg-slate-900/30 border-slate-800 opacity-60 grayscale-[0.5]' : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'}`}
                >
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {task.status}
                    </span>
                    <button onClick={() => deleteTask(task._id)} className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <h4 className={`text-lg font-medium mb-4 ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto relative z-10">
                     <span className="text-[10px] text-slate-600 font-mono">ID: {task._id.slice(-6)}</span>
                     <button 
                       onClick={() => toggleStatus(task._id, task.status)}
                       className={`p-2 rounded-lg transition-all cursor-pointer ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-400 hover:bg-cyan-500 hover:text-white'}`}
                     >
                       <Check size={16} />
                     </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}