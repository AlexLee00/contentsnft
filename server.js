const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true})) 

app.listen(8080, function(){
    console.log('listening on 8080')
});

// 서버 명령어는 크게 4가지 : 읽기(get), 쓰기(post), 수정(), 삭제(delete)

app.get('/pet', function(요청, 응답){
    응답.send('펫쇼핑할 수 있는 사이트입니다.');
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티용품 쇼핑 페이지임');
});

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/main.html')
});

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html')
});

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
// 2. 하위문서를 나타낼땐 /
// 3. 파일확장자(.html) 쓰지말기
// 4. 띄어쓰기는 대시(-) 이용
// 5. 자료 하나당 하나의 URL

app.post('/add', function(요청, 응답){
    응답.send('전송완료')
    console.log(요청.body.title);
    console.log(요청.body.date);
})

// nodemon server.js 노드 자동재실행