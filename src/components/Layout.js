// 3.3 We create another directory "components" to hold inside the components that are more for layout and associated with features. In this component Layout we create a base template for our web app. If we had a header or a footer, we would put it here in this component. And the "Outlet" represents all the children components. When we put the layout component into our application it can then represent all of these children underneath.
// (Go to [src/App.js])
import {Outlet} from "react-router-dom";
import Header from "./Header";

// 3.8 We'll import and insert our new Header component here.
const Layout = () => {
  return (
    <>
      <Header/>
      <main className="App">
        <Outlet/>
      </main>
    </>
  );
};

export default Layout;