import Login from './../container/Login/index';
import Signup from './../container/Signup/index';
import NewsBoard from './../container/NewsBoard/index';
import Profile from './../container/Profile/index';

export const PAGE_ROUTES = [
    {
        path:'/home',
        component: NewsBoard,
        exact : true,
    },
    {
        path:'/home/profile',
        component: Profile,
        exact : true,
    }
];


export const LOGIN_ROUTES = [
    {
        path:'/login',
        component: Login,
        exact : true
    },
    {
        path:'/signup',
        component: Signup,
        exact : true,
    }
];