import * as newsConstants from './../constants/news';

const initialState = {
    newsList : [
        // {
        //     id : 0,
        //     nameUser:'DaoAnhTu',
        //     image: 'https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg',
        //     createdAt : '20:30:11 21 thg3 2020',
        //     content : 'ảnh corgi',
        //     likeCount : 3,
        //     shareCount : 1
        // },
        // {
        //     id : 0,
        //     nameUser:'DaoAnhTu',
        //     image: 'https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg',
        //     createdAt : '20:30:11 21 thg3 2020',
        //     content : 'ảnh corgi',
        //     likeCount : 3,
        //     shareCount : 1
        // },
        // {
        //     id : 0,
        //     nameUser:'DaoAnhTu',
        //     image: 'https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg',
        //     createdAt : '20:30:11 21 thg3 2020',
        //     content : 'ảnh corgi',
        //     likeCount : 3,
        //     shareCount : 1
        // },
        // {
        //     id : 0,
        //     nameUser:'DaoAnhTu',
        //     image: 'https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg',
        //     createdAt : '20:30:11 21 thg3 2020',
        //     content : 'ảnh corgi',
        //     likeCount : 3,
        //     shareCount : 1
        // },
        // {
        //     id : 0,
        //     nameUser:'DaoAnhTu',
        //     image: 'https://tunglocpet.com/wp-content/uploads/2017/10/cho-corgi-pembroke-tunglocpet-03.jpg',
        //     createdAt : '20:30:11 21 thg3 2020',
        //     content : 'ảnh corgi',
        //     likeCount : 3,
        //     shareCount : 1
        // }
    ]
};

const reducer = (state = initialState,action) =>{
    switch(action.type){
        //lấy dữ liệu 
        case newsConstants.FETCH_NEWS_SUCCESS :{
            const {data} = action.payload;
            console.log(data,"reducer-new");
            return {
                ...state,
                newsList : data
            }
        }
        case newsConstants.FETCH_NEWS_FAILED :{
            const {err} = action.payload;
            console.log(err);
            return {
                ...state
            }
        }
        default : {
            return {...state};
        }
    };
};

export default reducer;

