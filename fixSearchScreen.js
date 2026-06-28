const fs = require('fs');

let file = 'src/screens/SearchScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove task related state and filtering
content = content.replace(/const filteredTasks = query \? tasks\.filter\(t =>[\s\S]*?\) : tasks;\n/, '');
content = content.replace(/const activeTasks = filteredTasks;\n/, '');

// Remove toggle task pin
const handleTogglePinTask = /const handleTogglePinTask = \(e: React\.MouseEvent, task: Task\) => \{[\s\S]*?\};\n/;
content = content.replace(handleTogglePinTask, '');

// Remove renderTaskCard
const renderTaskCard = /const renderTaskCard = \(task: Task, isLast: boolean\) => \{[\s\S]*?  \};\n/;
content = content.replace(renderTaskCard, '');

// Fix groupBy state and mapping
content = content.replace(/\| 'Level Tugas' /g, '');
content = content.replace(/'Semua', 'Level Tugas', 'Tag Catatan'/g, "'Semua', 'Tag Catatan'");

// Remove the Level Tugas grouped content render
const renderGroupedContent = /if \(groupBy === 'Level Tugas'\) \{[\s\S]*?\} else if \(groupBy === 'Tag Catatan'\)/;
content = content.replace(renderGroupedContent, "if (groupBy === 'Tag Catatan')");

// In the default "Semua" rendering, remove tasks
const defaultTasksRender = /\{activeTasks\.length > 0 && \([\s\S]*?\}\)\}\s*(?=<div className="grid)/;
content = content.replace(defaultTasksRender, '');

const checkSquareImport = /CheckSquare, /;
content = content.replace(checkSquareImport, '');
const taskImport = /, Task /;
content = content.replace(taskImport, ' ');
const toggleTaskImport = /toggleTask, updateTask, /;
content = content.replace(toggleTaskImport, '');
const deleteTaskImport = /deleteTask, /;
content = content.replace(deleteTaskImport, '');

// Also remove task count from header
content = content.replace(/ \+ activeTasks\.length/, '');
content = content.replace(/\{lang === 'id' \? 'catatan & tugas' : 'notes & tasks'\}/, "{lang === 'id' ? 'catatan' : 'notes'}");

fs.writeFileSync(file, content);
