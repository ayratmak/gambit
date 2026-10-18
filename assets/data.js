/* Gambit course catalogue. Each course lives in assets/courses/<id>.js and pushes itself onto
   window.GAMBIT_COURSES; this file orders them. Step formats: docs/STEP-TYPES.md.
   Check every course with: node tools/validate-courses.js */
(() => {
  window.COURSES = (window.GAMBIT_COURSES || []).slice().sort((a, b) => a.order - b.order);
})();
