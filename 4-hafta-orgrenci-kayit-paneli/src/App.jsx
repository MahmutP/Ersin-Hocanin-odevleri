import { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import './App.css';

function App() {
  const [students, setStudents] = useState([
    { id: 1, ad: 'Ahmet Yılmaz', bolum: 'Yazılım Mühendisliği' },
    { id: 2, ad: 'Ayşe Demir', bolum: 'Grafik Tasarım' }
  ]);

  const addStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Üniversite Kayıt Sistemi</h1>
        <p>Öğrenci Yönetim Paneli</p>
      </header>

      <main className="main-content">
        <div className="left-column">
          <StudentForm addStudent={addStudent} />
        </div>

        <div className="right-column">
          <StudentList students={students} deleteStudent={deleteStudent} />
        </div>
      </main>
    </div>
  );
}

export default App;
