// express 라이브러리 사용 설정(라이브러리 설치 필요)
const express = require('express');
const app = express();
// body-parser 라이브러리 사용 설정 (라이브러리 설치 필요)
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));


// db에 저장하는 코드
var db; // db 변수 생성
MongoClient.connect('mongodb+srv://web-ex:f7zRS8qIRmaNjNlV@cluster0.hrofh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true }, function(에러, client){
    
    // 연결되면 할일
    if (에러) return console.log(에러)
	db = client.db('todoapp');

    //db.collection('todo').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){
	//    console.log('저장완료'); 
	//});

    app.listen(8080, function(){
        console.log('listening on 8080')
    });
}); 

// 8080포트 사용 설정 code
// app.listen(8080, function(){
//     console.log('listening on 8080')
// });

// 서버 명령어는 크게 4가지 : 읽기(get), 쓰기(post), 수정(), 삭제(delete)

// 웹브라우저에서 localhost:8080/pet 으로 접근하였을때 '펫쇼핑할 수 있는 사이트입니다.' 읽기
app.get('/pet', function(요청, 응답){
    응답.send('펫쇼핑할 수 있는 사이트입니다.');
});

// 웹브라우저에서 localhost:8080/beauty 으로 접근하였을때 '뷰티쇼핑할 수 있는 사이트입니다.' 읽기
app.get('/beauty', function(요청, 응답){
    응답.send('뷰티쇼핑할 수 있는 사이트입니다.');
});

// 웹브라우저에서 localhost:8080/ 으로 접근하였을때 'main.html' 읽기
// app.get('/', function(요청, 응답){
//     응답.sendFile(__dirname + '/main.html')
// });

app.get('/', function(요청, 응답){
    응답.render('main.ejs');    
})

// 웹브라우저에서 localhost:8080/ 으로 접근하였을때 'write.html' 읽기
// app.get('/write', function(요청, 응답){
//     응답.sendFile(__dirname + '/write.html')
// });

app.get('/write', function(요청, 응답){
    응답.render('write.ejs');    
})

// app.post('/add', function(요청, 응답){
//     응답.send('전송완료')
//     console.log(요청.body.date);
//     console.log(요청.body.title); 
//     db.collection('todo').insertOne( {제목 : 요청.body.title, 날짜 : 요청.body.date} , function(에러, 결과){
// 	    console.log('저장완료'); 
// 	});
// });

// REST 원칙 6개
// 1. Uniform interface
//   - 하나의 자료는 하나의 URL로
//   - URL 하나를 알면 둘을 알 수 있어야함
//   - 요청과 응답은 정보가 충분히 들어있어야 함
// 2. Client-Server 역할구분
//   - 브라우저는 요청만 할 뿐
//   - 서버는 응답만 할 뿐
// 3. Stateless
//   - 요청1과 요청2는 의존성이 없어야함
// 4. Cacheable
//   - 서버에서 보내주는 정보들은 캐싱이 가능해야함
//   - 캐싱을 위한 버전 같은 것도 관리 잘해야함
//   (실은 브라우저가 잘해줌)
// 5. Layered System
// 6. Code on Demand

// 좋은 REST API 이름짓기 원칙
// 1. URL을 명사로 작성 추천
// 2. 하위문서를 나타낼땐
// 3. 파일확장자(.html) 쓰지말기
// 4. 띄어쓰기는 대시(-) 이용
// 5. 자료 하나당 하나의 URL

// nodemon server.js 노드 자동재실행
// 웹사이트 기능만들기 기본
// 1. 서버로 데이터 전송할 수 있는 UI 만들고
// 2. 서버에서 원하는대로 정보를 처리해주면 됨

// /list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌

// '/add' 클릭 시 쓰기 로그에 title와 date 표현

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;

        db.collection('todo').insertOne( {_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date} , function(에러, 결과){
            //console.log('저장완료');
            
            // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함;
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost:1} }, function(에러, 결과){
                // if(에러){return console.log(에러)}
                // 응답.send('전송완료');
            })
        })
    })

});

app.get('/list', function(요청, 응답){
// 디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('todo').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', {posts : 결과});
    })
})

app.delete('/delete', function(요청, 응답){
    //console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    // 요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('todo').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다' });
    })
})

app.get('/detail/:id', function(요청, 응답){
    db.collection('todo').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        응답.render('detail.ejs', {data : 결과});
    })
})


app.get('/edit/:id', function(요청, 응답){
    db.collection('todo').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과)
        응답.render('edit.ejs', {post : 결과})
    })
})


app.put('/edit', function(요청, 응답){
    //폼에 담긴 제목데이터, 날짜데이터를 가지고
    db.collection('todo').updateOne({_id : parseInt(요청.body.id)}, {$set : {제목 : 요청.body.title, 날짜 : 요청.body.date}}, function(에러, 결과){
        console.log('수정완료')
        응답.redirect('/list')
    })
})

