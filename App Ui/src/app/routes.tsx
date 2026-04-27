import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { Chats } from "./pages/Chats";
import { Profile } from "./pages/Profile";
import { Marketplace } from "./pages/Marketplace";
import { Resources } from "./pages/Resources";
import { Alumni } from "./pages/Alumni";
import { Assistant } from "./pages/Assistant";
import { Feedback } from "./pages/Feedback";
import { Mapper } from "./pages/Mapper";
import { SafetyReport } from "./pages/SafetyReport";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: Welcome },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  {
    path: "/app",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Home },
      { path: "events", Component: Events },
      { path: "chats", Component: Chats },
      { path: "profile", Component: Profile },
      { path: "marketplace", Component: Marketplace },
      { path: "resources", Component: Resources },
      { path: "alumni", Component: Alumni },
      { path: "assistant", Component: Assistant },
      { path: "feedback", Component: Feedback },
      { path: "mapper", Component: Mapper },
      { path: "safety", Component: SafetyReport },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);
