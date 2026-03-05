import React from 'react';

const StudentList = ({ students, deleteStudent }) => {
    return (
        <div className="glass-panel list-panel">
            <h2>Öğrenci Listesi ({students.length})</h2>

            {students.length === 0 ? (
                <div className="empty-state">
                    <p>Henüz kayıtlı öğrenci bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Öğrenci Adı</th>
                                <th>Bölümü</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="student-row">
                                    <td className="student-name">{student.ad}</td>
                                    <td className="student-dept">{student.bolum}</td>
                                    <td className="student-action">
                                        <button
                                            onClick={() => deleteStudent(student.id)}
                                            className="btn-delete"
                                            title="Öğrenciyi Sil"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentList;
