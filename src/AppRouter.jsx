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
import AdminLayout from './layouts/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Product from './pages/admin/product/Product';
import EditProduct from './pages/admin/product/EditProduct';
import Inventory from './pages/admin/inventory/Inventory';
import AddGoodReceivedNote from './pages/admin/inventory/AddGoodReceivedNote';
import CategoryAndPlacement from './pages/admin/application/CategoryAndPlacement';
import ProductAttribute from './pages/admin/application/ProductAttribute';
import Order from './pages/admin/order/Order';
import Customers from './pages/admin/customers/Customers';
import Promotions from './pages/admin/promotion/Promotions';

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
        <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='products'  >
                <Route index element={<Product />} />
                <Route path='edit/:id' element={<EditProduct />} />
            </Route>
            <Route path='inventory' >
                <Route index element={<Inventory />} />
                <Route path='add-good-received-note' element={<AddGoodReceivedNote />} />
            </Route>
            <Route path='application' >
              <Route path='categories' element={<CategoryAndPlacement />} />
              <Route path='attributes' element={<ProductAttribute />} />
            </Route>
            <Route path='orders'  >
              <Route index element={<Order />} />
            </Route>
            <Route path='customers' >
              <Route index element={<Customers />} />
            </Route>
            <Route path='promotions' >
              <Route index element={<Promotions />} />
            </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
