import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashbord'
import CreateGoal from './components/CreateGoal'
import GoalDetails from './Pages/GoalDetails'
import MonthDetails from './Pages/MonthDetails'
import WeekDetails from './Pages/WeekDetails'
import DailyPlanner from './Pages/DailyPlanner'
import LaunchpadLanding from './Pages/LaunchpadLanding'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import AICoach from './Pages/AICoach'
import Goals from './Pages/Goals'
import Resources from './Pages/Resources'
import Progress from './Pages/Progress'
import Profile from './Pages/Profile'
import Planner from './Pages/Planner'
import Settings from './Pages/Settings'


function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<LaunchpadLanding/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signUp' element={<SignUp/>}/>

     <Route path='/dashboard' element={
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
      }/>

    <Route path='/create-goal' element={<CreateGoal/>}/>
    <Route path='/goals/:goalId' element={<GoalDetails/>}/>
    <Route path='/goals/:goalId/month/:monthIndex' element={<MonthDetails/>}/>
    <Route path='/goals/:goalId/month/:monthIndex/week/:weekIndex' element={<WeekDetails/>}/>
    <Route path='/goals/:goalId/month/:monthIndex/week/:weekIndex/day/:dayIndex' element={<DailyPlanner/>}/>
    <Route path='/ai-coach' element={<AICoach/>}/>
    <Route path='/goals' element={<Goals/>}/>
    <Route path='/resources' element={<Resources/>}/>
    <Route path='/progress' element={<Progress/>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/planner' element={<Planner/>}/>
    <Route path='/Settings' element={<Settings/>}/>
    </Routes>
    </>
  )
}

export default App
