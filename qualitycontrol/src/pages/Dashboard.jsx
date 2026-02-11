import { NavLink, Routes, Route } from "react-router-dom";
import Products from "./Product";
import Laboratuvar from "./Laboratuvar";
import User from "./User";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>QC PANEL</h3>

        <NavLink className="menu-btn" to="products">
          Ürünler
        </NavLink>

        <NavLink className="menu-btn" to="laboratuvar">
          Laboratuvar
        </NavLink>

        <NavLink className="menu-btn" to="user">
          User
        </NavLink>
      </div>

      {/* CONTENT */}
      <div className="content">
        <Routes>
          <Route path="products" element={<Products />} />
          <Route path="laboratuvar" element={<Laboratuvar />} />
          <Route path="user" element={<User />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
