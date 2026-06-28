import fs from 'fs';
const content = fs.readFileSync('src/screens/TasksScreen.tsx', 'utf-8');

const newDisciplineView = `const DisciplineView = React.memo<{ task?: Task, onSelectExisting: () => void, lang: string }>(({ task, onSelectExisting, lang }) => {
  const { updateTask, checkInDaily } = useAppStore();
  const [fullScreenImage, setFullScreenImage] = useState<{ url: string, type: 'beforePhotoUrl' | 'afterPhotoUrl' | 'after1MonthPhotoUrl' | 'after6MonthsPhotoUrl' | 'after1YearPhotoUrl' } | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activeTab, setActiveTab] = useState<'Aksi' | 'Jurnal' | 'Galeri'>('Aksi');
  
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
          <Target className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">{lang === 'id' ? 'Fokus Disiplin' : 'Discipline Focus'}</h3>
        <p className="text-sm text-slate-400 mb-8 max-w-[280px] leading-relaxed">
          {lang === 'id' 
            ? 'Pilih 1 tugas utama yang ingin Anda ubah menjadi kebiasaan kuat. Pantau transformasi Anda di sini.' 
            : 'Select 1 main task you want to turn into a strong habit. Track your transformation here.'}
        </p>
        <button 
          onClick={onSelectExisting}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
        >
          {lang === 'id' ? 'Buat Tugas Disiplin' : 'Create Discipline Task'}
        </button>
      </div>
    );
  }

  const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const yesterdayDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000) - 86400000).toISOString().split('T')[0];
  
  const d = task.disciplineData || {};
  const checkins = d.dailyCheckins || [];
  const lastCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : null;
  const isMissedDay = lastCheckin && lastCheckin !== today && lastCheckin !== yesterdayDate;
  const hasStarted = checkins.length > 0;
  
  const handlePhotoUpload = (type: 'beforePhotoUrl' | 'afterPhotoUrl' | 'after1MonthPhotoUrl' | 'after6MonthsPhotoUrl' | 'after1YearPhotoUrl') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateTask({
            ...task,
            disciplineData: {
              ...d,
              [type]: event.target?.result as string
            }
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemovePhoto = (e: React.MouseEvent, type: 'beforePhotoUrl' | 'afterPhotoUrl' | 'after1MonthPhotoUrl' | 'after6MonthsPhotoUrl' | 'after1YearPhotoUrl') => {
    e.stopPropagation();
    updateTask({
      ...task,
      disciplineData: {
        ...d,
        [type]: undefined
      }
    });
  };

  return (
    <div className="animate-in fade-in duration-300 pb-8 px-1 space-y-6">
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-indigo-500/10 via-slate-900/80 to-slate-900 border border-indigo-500/10 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-black/20 backdrop-blur-sm">
        <div className="absolute -top-10 -right-10 p-6 opacity-5 rotate-12">
          <Target className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 border border-indigo-500/20 px-3 py-1 rounded-full">
              {lang === 'id' ? 'Tujuan Utama' : 'Main Goal'}
            </span>
            {hasStarted && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" /> {d.dailyCheckins?.length || 0} {lang === 'id' ? 'Hari Streak' : 'Day Streak'}
              </span>
            )}
          </div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-2xl font-bold text-slate-50 pr-4 leading-tight tracking-tight">{task.title}</h2>
            <button
              onClick={() => updateTask({ ...task, pinned: !task.pinned })}
              className={\`p-2 rounded-full border transition-all \${task.pinned ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/80 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30'}\`}
              title={lang === 'id' ? 'Sematkan di Beranda' : 'Pin to Home'}
            >
              <Pin className={\`w-5 h-5 \${task.pinned ? 'fill-indigo-400' : ''}\`} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
        {(['Aksi', 'Jurnal', 'Galeri'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all \${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800/50'}\`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {/* TAB: AKSI */}
        {activeTab === 'Aksi' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Daily Check-in Streak */}
            <div className="bg-gradient-to-r from-orange-500/10 to-slate-900/80 border border-orange-500/10 rounded-3xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute -left-4 -bottom-4 opacity-5 pointer-events-none">
                 <Flame className="w-32 h-32 text-orange-500" />
              </div>
              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const checkinsArr = d.dailyCheckins || [];
                    if (!checkinsArr.includes(todayStr)) {
                      updateTask({ ...task, disciplineData: { ...d, dailyCheckins: [...checkinsArr, todayStr] } });
                      checkInDaily();
                    }
                  }}
                  disabled={d.dailyCheckins?.includes(new Date().toISOString().split('T')[0])}
                  className={\`w-full px-5 py-4 rounded-2xl font-bold text-sm transition-all \${
                    d.dailyCheckins?.includes(new Date().toISOString().split('T')[0])
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-800'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95'
                  }\`}
                >
                  {d.dailyCheckins?.includes(new Date().toISOString().split('T')[0]) 
                    ? (lang === 'id' ? 'Selesai Hari Ini' : 'Done Today') 
                    : (lang === 'id' ? 'Check-in Sekarang' : 'Check-in Now')}
                </button>
                
                <button
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const checkinsArr = d.dailyCheckins || [];
                    const rests = d.usedRestDates || [];
                    if (!checkinsArr.includes(todayStr)) {
                      updateTask({ 
                        ...task, 
                        disciplineData: { 
                          ...d, 
                          dailyCheckins: [...checkinsArr, todayStr],
                          usedRestDates: [...rests, todayStr]
                        } 
                      });
                      checkInDaily();
                    }
                  }}
                  disabled={
                    d.dailyCheckins?.includes(new Date().toISOString().split('T')[0]) || 
                    ((d.usedRestDates || []).filter(date => (new Date().getTime() - new Date(date).getTime()) < 7 * 24 * 60 * 60 * 1000).length >= 1)
                  }
                  className={\`w-full px-5 py-3 rounded-2xl font-bold text-sm transition-all border \${
                    d.dailyCheckins?.includes(new Date().toISOString().split('T')[0]) || ((d.usedRestDates || []).filter(date => (new Date().getTime() - new Date(date).getTime()) < 7 * 24 * 60 * 60 * 1000).length >= 1)
                      ? 'bg-slate-900/50 text-slate-500 border-slate-800 cursor-not-allowed'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border-slate-700 active:scale-95'
                  }\`}
                >
                  {lang === 'id' ? 'Gunakan Jatah Libur (1x/Minggu)' : 'Use Rest Day (1x/Week)'}
                </button>
              </div>
            </div>
            
            {/* Missed / Success Status */}
            {isMissedDay && d.punishment && !task.completed && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 shadow-lg shadow-rose-900/10 flex items-start gap-4 backdrop-blur-sm relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0 border border-rose-500/30 relative z-10">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-rose-400 mb-1">{lang === 'id' ? 'Anda Melewatkan Hari!' : 'You Missed a Day!'}</h3>
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed pr-6">{lang === 'id' ? 'Sesuai komitmen awal, Anda harus menerima konsekuensi:' : 'As per your commitment, you must accept the consequence:'}</p>
                  <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20 shadow-inner">
                    <span className="text-sm font-bold text-slate-100">{d.punishment}</span>
                  </div>
                </div>
              </div>
            )}

            {task.completed && d.reward && (
              <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 shadow-xl text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/30 rotate-3">
                  <Gift className="w-8 h-8 -rotate-3" />
                </div>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">{lang === 'id' ? 'Misi Berhasil Ditamatkan! 🎉' : 'Mission Completed! 🎉'}</h2>
                <div className="bg-emerald-500/10 rounded-2xl px-4 py-3 border border-emerald-500/20 inline-block mt-2">
                  <span className="text-base font-bold text-slate-100">{d.reward}</span>
                </div>
              </div>
            )}

            {/* Date & Settings */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">{lang === 'id' ? 'Mulai' : 'Start'}</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Calendar className="w-4 h-4 text-indigo-400/70" />
                    {d.startDate || task.date}
                  </div>
               </div>
               <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">{lang === 'id' ? 'Target' : 'Target'}</span>
                  <input 
                    type="date" 
                    value={d.targetDate || ''}
                    onChange={(e) => updateTask({ ...task, disciplineData: { ...d, targetDate: e.target.value } })}
                    className="bg-transparent text-sm font-medium text-slate-300 focus:outline-none w-full"
                  />
               </div>
            </div>
            
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">{lang === 'id' ? 'Alarm Pengingat' : 'Reminder Alarm'}</span>
                 <span className="text-[10px] text-slate-400">{lang === 'id' ? 'Aktif setiap hari' : 'Active every day'}</span>
               </div>
               <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
                 <Bell className="w-4 h-4 text-indigo-400/70" />
                 <input 
                   type="time" 
                   value={task.alarmTime || ''}
                   onChange={(e) => updateTask({ ...task, alarmTime: e.target.value || undefined })}
                   className="bg-transparent text-sm font-bold text-slate-200 focus:outline-none w-20"
                 />
               </div>
            </div>

            {/* Contract Rules */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{lang === 'id' ? 'Kontrak Komitmen' : 'Commitment Contract'}</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-colors focus-within:border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'id' ? 'Hadiah Keberhasilan' : 'Success Reward'}</span>
                  </div>
                  <textarea 
                    value={d.reward || ''}
                    onChange={(e) => updateTask({ ...task, disciplineData: { ...d, reward: e.target.value } })}
                    placeholder={lang === 'id' ? 'Apa hadiah jika tercapai?' : 'What is your reward?'}
                    disabled={hasStarted}
                    className={\`w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none min-h-[40px] \${hasStarted ? 'opacity-50' : ''}\`}
                  />
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-colors focus-within:border-rose-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'id' ? 'Konsekuensi Gagal' : 'Failure Consequence'}</span>
                  </div>
                  <textarea 
                    value={d.punishment || ''}
                    onChange={(e) => updateTask({ ...task, disciplineData: { ...d, punishment: e.target.value } })}
                    placeholder={lang === 'id' ? 'Apa konsekuensinya?' : 'What is the consequence?'}
                    disabled={hasStarted}
                    className={\`w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none min-h-[40px] \${hasStarted ? 'opacity-50' : ''}\`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: JURNAL */}
        {activeTab === 'Jurnal' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'id' ? 'Alasan Kuat (Why)' : 'Strong Reason (Why)'}</h3>
                {hasStarted && <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-400">{lang === 'id' ? 'Terkunci' : 'Locked'}</span>}
              </div>
              <div className={\`bg-slate-900/80 border border-slate-800 rounded-2xl p-4 \${hasStarted ? 'opacity-70' : 'focus-within:border-indigo-500/30'}\`}>
                <textarea 
                  value={d.motivation || ''}
                  onChange={(e) => updateTask({ ...task, disciplineData: { ...d, motivation: e.target.value } })}
                  placeholder={lang === 'id' ? 'Alasan terdalam kenapa harus mencapai ini...' : 'Deepest reason to achieve this...'}
                  disabled={hasStarted}
                  className="w-full min-h-[80px] bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{lang === 'id' ? 'Catatan Harian' : 'Daily Notes'}</h3>
              
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 focus-within:border-indigo-500/30 mb-4 shadow-sm">
                <textarea 
                  id={\`new-note-\${task.id}\`}
                  placeholder={lang === 'id' ? 'Progress hari ini...' : 'Today\\'s progress...'}
                  className="w-full min-h-[60px] bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const textarea = document.getElementById(\`new-note-\${task.id}\`) as HTMLTextAreaElement;
                      if (textarea && textarea.value.trim()) {
                        const newLog = [...(d.journeyLog || []), {
                          id: Date.now().toString(),
                          date: new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                          content: textarea.value.trim()
                        }];
                        updateTask({ ...task, disciplineData: { ...d, journeyLog: newLog } });
                        textarea.value = '';
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
                  >
                    {lang === 'id' ? 'Simpan' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {d.journeyLog?.slice().reverse().map((note) => (
                  <div key={note.id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 group">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{note.date}</span>
                       <button 
                         onClick={() => {
                           const newLog = d.journeyLog?.filter(n => n.id !== note.id);
                           updateTask({ ...task, disciplineData: { ...d, journeyLog: newLog } });
                         }}
                         className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: GALERI */}
        {activeTab === 'Galeri' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{lang === 'id' ? 'Transformasi Visual' : 'Visual Transformation'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => d.beforePhotoUrl ? setFullScreenImage({ url: d.beforePhotoUrl, type: 'beforePhotoUrl' }) : handlePhotoUpload('beforePhotoUrl')}
                className="aspect-[3/4] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:border-slate-700"
              >
                {d.beforePhotoUrl ? (
                  <>
                    <img src={d.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">{lang === 'id' ? 'Sebelum' : 'Before'}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                     <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'id' ? 'Sebelum' : 'Before'}</span>
                  </div>
                )}
              </div>
              
              <div 
                onClick={() => d.afterPhotoUrl ? setFullScreenImage({ url: d.afterPhotoUrl, type: 'afterPhotoUrl' }) : handlePhotoUpload('afterPhotoUrl')}
                className="aspect-[3/4] bg-indigo-500/10 border border-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:border-indigo-500/30"
              >
                {d.afterPhotoUrl ? (
                  <>
                    <img src={d.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-indigo-500/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">{lang === 'id' ? 'Sesudah' : 'After'}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-500/40">
                     <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'id' ? 'Sesudah' : 'After'}</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="w-full py-3 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-colors uppercase tracking-wider"
            >
              {showAllPhotos ? (lang === 'id' ? 'Tutup Milestone' : 'Close Milestones') : (lang === 'id' ? 'Tampilkan Milestone Bulanan' : 'Show Monthly Milestones')}
            </button>

            {showAllPhotos && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div 
                  onClick={() => d.after1MonthPhotoUrl ? setFullScreenImage({ url: d.after1MonthPhotoUrl, type: 'after1MonthPhotoUrl' }) : handlePhotoUpload('after1MonthPhotoUrl')}
                  className="aspect-[3/4] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer hover:border-slate-700"
                >
                  {d.after1MonthPhotoUrl ? (
                    <>
                      <img src={d.after1MonthPhotoUrl} alt="1 Month" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{lang === 'id' ? '1 Bulan' : '1 Month'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                       <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'id' ? '1 Bulan' : '1 Month'}</span>
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => d.after6MonthsPhotoUrl ? setFullScreenImage({ url: d.after6MonthsPhotoUrl, type: 'after6MonthsPhotoUrl' }) : handlePhotoUpload('after6MonthsPhotoUrl')}
                  className="aspect-[3/4] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer hover:border-slate-700"
                >
                  {d.after6MonthsPhotoUrl ? (
                    <>
                      <img src={d.after6MonthsPhotoUrl} alt="6 Months" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{lang === 'id' ? '6 Bulan' : '6 Months'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                       <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'id' ? '6 Bulan' : '6 Months'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {fullScreenImage && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg flex justify-between items-center mb-4">
             <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                {lang === 'id' ? 'Galeri Transformasi' : 'Transformation Gallery'}
             </span>
             <button onClick={() => setFullScreenImage(null)} className="p-2 bg-slate-800/80 text-slate-300 rounded-full hover:bg-slate-700">
               <X className="w-5 h-5" />
             </button>
          </div>
          <img src={fullScreenImage.url} alt="Transformation Full" className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
          <button 
             onClick={(e) => { 
               e.stopPropagation();
               setFullScreenImage(null); 
               handleRemovePhoto(e, fullScreenImage.type); 
             }}
             className="mt-6 flex items-center gap-2 bg-rose-500/10 text-rose-400 px-6 py-3 rounded-2xl font-bold hover:bg-rose-500/20 transition-colors"
          >
             <Trash2 className="w-4 h-4" />
             {lang === 'id' ? 'Hapus Foto Ini' : 'Remove This Photo'}
          </button>
        </div>
      )}
    </div>
  );
});`

const beforeRegex = /const DisciplineView = React\.memo.*?^}\);\n/ms;
const newContent = content.replace(beforeRegex, newDisciplineView + '\n');
fs.writeFileSync('src/screens/TasksScreen.tsx', newContent);
console.log('done');
