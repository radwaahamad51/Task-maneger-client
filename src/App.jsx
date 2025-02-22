// // App.jsx
// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//  // Firebase Authentication context
//  // Context for managing tasks



// import TaskBoard from './assets/component/taskboard';
// import { useAuth } from './assets/component/Auth';
// import Login from './login';

// function App() {
//   const { user, loginWithGoogle, logout } = useAuth();

//   return (
//     <Router>
//       <div className="App">
        
//         <Routes>
//           <Route
//             path="/"
//             element={
//               user ? (
//                 <TaskProvider>
//                   <TaskBoard />
//                 </TaskProvider>
//               ) : (
//                 <Login loginWithGoogle={loginWithGoogle} />
//               )
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
