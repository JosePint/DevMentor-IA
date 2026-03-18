import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Lesson } from './pages/Lesson';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="achievements" element={<div className="p-8 text-white">Conquistas em breve!</div>} />
          </Route>
          <Route path="/lesson/:courseId/:lessonId" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
