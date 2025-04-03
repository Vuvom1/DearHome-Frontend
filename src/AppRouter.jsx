import { HashRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/authentication/Auth';
import Home from './pages/customer/Home';
import CustomerLayout from './layouts/customer/CustomerLayout';
import Products from './pages/customer/Products';
import CategoryDetails from './pages/customer/CategoryDetails';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import CustomerProfile from './pages/customer/CustomerProfile';
import { URLS } from './constants/urls';

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={URLS.CUSTOMER.HOME} element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path={URLS.CUSTOMER.PRODUCTS} element={<Products />} />
            <Route path={`${URLS.CUSTOMER.PRODUCTS}/:id`} element={<ProductDetails />} />
            <Route path={URLS.CUSTOMER.CART} element={<Cart />} />
            <Route path={URLS.CUSTOMER.CHECKOUT} element={<Checkout />} />
            <Route path={URLS.CUSTOMER.PROFILE} element={<CustomerProfile />} />
            <Route path={`${URLS.CUSTOMER.CATEGORIES}/:id`} element={<CategoryDetails />} />
        </Route>
        <Route path={URLS.AUTH.LOGIN} element={<Auth />}>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
