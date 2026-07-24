import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashbord'
import CreateGoal from './components/CreateGoal'
import GoalDetails from './Pages/GoalDetails'
import MonthDetails from './Pages/MonthDetails'
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
import Layout from './components/Layout'
import GoalLayout from './components/GoalLayout'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<LaunchpadLanding/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signUp' element={<SignUp/>}/>

      <Route path='/create-goal' element={<CreateGoal/>}/>
      <Route path='/create-goal/:draftId' element={<CreateGoal/>}/>
      <Route element={<GoalLayout/>}>
<Route path='/goals/:goalId' element={<GoalDetails/>}/>
    <Route path='/goals/:goalId/month/:monthIndex' element={<MonthDetails/>}/>
    <Route path='/goals/:goalId/month/:monthIndex/day/:dayIndex' element={<DailyPlanner/>}/>
      </Route>
    

    <Route element={<Layout/>}>
     <Route path='/dashboard' element={
       <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
      }/>
    <Route path='/ai-coach' element={<AICoach/>}/>
    <Route path='/goals' element={<Goals/>}/>
    <Route path='/resources' element={<Resources/>}/>
    <Route path='/progress' element={<Progress/>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/planner' element={<Planner/>}/>
    <Route path='/Settings' element={<Settings/>}/>
    </Route>
    </Routes>
    </>
  )
}

export default App
