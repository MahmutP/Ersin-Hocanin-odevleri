import React, { useState } from 'react';

const StudentForm = ({ addStudent }) => {
    const [student, setStudent] = useState({ ad: '', bolum: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!student.ad.trim() || !student.bolum.trim()) return;

        addStudent({ id: Date.now(), ...student });
        setStudent({ ad: '', bolum: '' }); // Reset form
    };

    return (
        <div className="glass-panel form-panel">
            <h2>Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleSubmit} className="student-form">
                <div className="input-group">
                    <label htmlFor="ad">Öğrenci Adı Soyadı</label>
                    <input
                        type="text"
                        id="ad"
                        name="ad"
                        value={student.ad}
                        onChange={handleChange}
                        placeholder="Örn. Ali Yılmaz"
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="bolum">Bölümü</label>
                    <input
                        type="text"
                        id="bolum"
                        name="bolum"
                        value={student.bolum}
                        onChange={handleChange}
                        placeholder="Örn. Bilgisayar Mühendisliği"
                        required
                        autoComplete="off"
                    />
                </div>
                <button type="submit" className="btn-submit">
                    <span>Kayıt Ekle</span>
                </button>
            </form>
        </div>
    );
};

export default StudentForm;
