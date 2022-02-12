# JavaScript30

이 저장소는 [JavaScript30](https://github.com/wesbos/JavaScript30) 챌린지에 참가하면서 작성한 코드와 그 과정에서 든 생각, 얻은 지식을 간단히 저장하는 곳입니다.

# Day 01 - JavaScript Drum Kit

## querySelector, querySelectorAll

querySelector는 제공한 선택자 또는 선택자 뭉치와 일치하는 문서 내 첫번째 Element를 반환한다. 일치하는 요소가 없으면 null을 반환한다.  
같은 id나 class일 경우 최상단 요소만 가져온다.
querySelectorAll을 이용해 일치하는 모든 Element를 가져올 수 있다.

```js
document.querySelector(".key .sound"); // key 클래스 안에 sound 클래스인 첫번째 요소를 반환한다.
document.querySelector("div #someId"); // class뿐만 아니라 tagName이나 id를 사용할 수 있다.
document.querySelector(`audio[data-key="${e.keyCode}"]`); // e.keyCode와 일치하는 data-key attribute를 가지는 audio tag인 Element를 반환한다.
document.querySelectorAll("audio"); // audio tag인 모든 Element를 배열로 반환한다.
```

## 가비지 컬렉션

오디오를 재생할 때, 빠르게 여러번 재생시키면 중복해서 재생되지 않는 문제가 발생했다. 그래서 아래와 같은 코드를 찾아 사용했다.

```js
const newAudio = audios[e.which].cloneNode(); // audio를 복사해서 재생함.
newAudio.play();
```

이때, 오디오를 재생할때마다, 오디오객체가 계속 생성되면서, 메모리를 낭비하는 게 아닌가 싶었다. 그래서 찾아보니, 자바스크립트도 가비지 컬렉터가 있어서, 접근이 불가능한 객체의 메모리를 자동으로 해제해준다. 맘놓고 써도 되겠다.

# Day 02 - JS and CSS Clock

## Date

Date 객체는 1970년 1월 1일 UTC(협정 세계시) 자정과의 시간 차이를 밀리초로 나타내는 정수 값을 담고있음.

> ### 생성
>
> ```js
> let now = new Date(); // 현재 날짜 및 시간
> let date2 = new Date("2022-01-22 21:20:30"); // 2022년 01월 22일 21:20:30
> ```
>
> ### get (대응하는 set함수들도 있음)
>
> ```js
> let date = new Date("2022-01-22 21:20:30");
> date.getHours(); // 21
> date.getMinutes(); // 20
> date.getSeconds(); // 30
> // 년, 월, 일, 요일, 시간, 분, 초, 밀리초, unix timestamp를 받거나 변경 가능
> ```
>
> ### 문자열로 변환
>
> ```js
> let date = new Date("2022-01-22 21:20:30");
> console.log(date.toString()); // Sat Jan 22 2022 21:20:30 GMT+0900 (대한민국 표준시)
> console.log(date.toDateString()); // Sat Jan 22 2022
> console.log(date.toLocaleString()); // 2022. 1. 22. 오후 9:20:30
> console.log(date.toLocaleDateString()); // 2022. 1. 22.
> ```

## transform: rotate() 의 기준점 바꾸기

시계침을 회전시키기 위해 transform: origin()을 사용했는데, 시계의 중심을 기준으로 회전하는 것이 아니라, 시계침의 중심을 기준으로 회전했다. 이를 해결하기 위해 transform-origin 속성을 사용했다.

```
transform-origin: x-position | y-position | z-position
```

transform-origin의 초기값이 50%, 50%여서 요소의 중앙이 회전의 중심이 되었던 것. x-position을 100%으로 하니 시계침이 오른쪽을 기준으로 회전하는 것을 볼 수 있었다. transform-origin은 rotate이외에도 scale과 skew에도 적용된다. [MDN문서](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin)의 Examples를 보면 직관적으로 이해가능.

## 크롬 개발자 도구로 css 바꿔보기

크롬 개발자 도구의 Elements의 styles탭에서 css를 바꿔볼 수 있다.

1. element.style에 css를 써서 속성 적용 가능.
2. transition: cubic-bezier나 display: flex옆에 뜨는 아이콘을 클릭하면 나오는 gui로 속성값을 바꿔볼 수 있다.
3. :hov를 클릭하면 임시로 pseudo 상태를 적용할 수 있다. (hover나 focus같은 것들)

이것들 이외에도 훨씬 많다!!

# Day 03 - CSS Variables

## data attribute

data 속성은 HTML 요소에 추가적인 정보를 저장할 수 있게 해준다. 아무 요소에나 data-로 시작하는 속성을 추가할 수 있다.

```html
<img src="img/blue_t.png" alt="tshirt" data-key="cloth" data-value="tshirt" />
```

이렇게 추가한 속성값들을 자바스크립트에서 쉽게 읽을 수 있다.

```js
const img = document.getElementById("img");

img.dataset.key; // cloth
img.dataset.value; // tshirt
```

CSS에서도 접근이 가능하다.

```css
img[data-value="tshirt"] {
  order: 0;
}
```

## 자바스크립트로 CSS 변수 제어하기

우선 CSS에서 변수는 이렇게 사용한다.

```css
:root {
  --spacing: 10px;
}

tag {
  margin: var(--spacing);
}
```

자바스크립트로 CSS 변수를 제어하려먼 이렇게 하면 된다.

```js
// document.documentElement와 document.querySelector(":root")는 똑같은 값을 반환함.
document.documentElement.style.setProperty(`--${name}`, value);
```

이렇게 변경한 변수를 다시 써서 그 변수를 참조하고있는 곳들의 값을 다시 바꿔줘야하나 고민했지만, 자바스크립트로 CSS 변수를 변경하면, 그 변수를 참조하고있는 곳들에서 변화가 자동으로 반영된다.

## 논리연산자를 이용한 대입

type변수에 event.target.dataset.sizing를 대입하고, 만약 undefined라면 ""로 바꿔주는 코드를 작성했다.

```js
let type = event.target.dataset.sizing;
if (!type) type = "";
```

이는 다음과 같이 한줄로 작성할 수 있다.

```js
const type = event.target.dataset.sizing || "";
```

이것으로 억지로 let으로 선언했던 type을 const으로 바꾸고, 더 간결하게 작성할 수 있었다.

### 왜이렇게 작동할까?

something || something2에서, something이 true라면, 어차피 전체가 true이므로, something2는 고려하지 않게 된다. 그래서 위의 예제에서, event.target.dataset.sizing가 true라면, 뒤를 고려하지 않고, type = event.target.dataset.sizing이 되고, false인 경우 뒤쪽으로 넘어가 type = ""이 된다.

# Day 04 - Array Cardio Day 1

## Array.from(), destructuring assignment

querySelectorAll()은 NodeList를 반환하기 때문에, map, filter같은 array method의 사용이 불가능하다. forEach는 사용가능하나, 다른 array method를 사용하고싶다면, Array.from()이나 destructuring assignment을 사용해보자.

```js
const array1 = [...someNodeList]; // destructuring assignment
const array2 = Array.from(someNodeList);
```

이러한 방법은 HTMLCollection이나, Map이나 Set같은 iterable object, object등에도 사용 가능하다.

## localeCompare

사전순으로 단어를 정렬하고 싶을때, string의 localeCompare라는 메소드를 사용해보자.

```js
users.sort((a, b) => a.name.localeCompare(b.name));
// 추가로, a.name < b.name 처럼 부등호를 이용할 수도 있지만, 굳이?
```

## console

지금까지 console.log만 썼었는데, console.table이란 메소드를 발견했다. 데이터를 표로 출력해주는 메소드인데, 이걸 보고 다른 유용한 console메소드를 추가로 찾아봤다.

### console.count

```js
console.count("counter"); // counter: 1
console.count("counter"); // counter: 2
console.count("counter"); // counter: 3
```

### console.time, console.timeEnd

```js
console.time("timer");
// some code...
console.timeEnd("timer"); // timer: 7.957ms
```

이외에도 많으니 찾아보면 좋을 것같다.

# Day 05 - Flex Panel Gallery

## transitionend 이벤트

transitionend 이벤트는 transition이 끝난 후 발생하는 이벤트이다.
여러 transition 유형이 있는데 어떤 유형의 transition이 종료된 것인지 알고싶다면, event.propertyName을 써보자.

```js
panel.addEventListener("transitionend", toggleActive);
function toggleActive(e) {
  console.log(e.propertyName); // flex-grow가 출력됨.
}
```

## toggle과, classList의 변화로 css 적용하기

패널의 열고 닫음을 표현하기 위해 아래와 같은 코드를 작성했다.

```js
if (target.classList.contains("open")) {
  target.style.flex = "1";
  target.classList.remove("open");
} else {
  target.style.flex = "5";
  target.classList.add("open");
}
```

위와 같이 remove와 add를 번갈아가며 사용해야 하는 경우, toggle을 사용하면 더 간결하게 코드를 짤 수 있다.

```js
if (target.classList.contains("open")) target.style.flex = "1";
else target.style.flex = "5";
target.classList.toggle("open");
```

추가로, 위와 같이 자바스크립트로 css를 직접 변경하지 않고, css에 class유무에 따라 스타일을 적용하도록 작성해둔다면, class의 toggle만으로도 스타일을 바꿀 수 있다.

```css
.panel > *:first-child {
  transform: translateY(-100%);
}
.panel.open-active > *:first-child {
  transform: translateY(0);
}
```

```js
target.classList.toggle("open-active");
```

이렇게 작성한다면, open-active라는 class를 토글링하면, css도 같이 토글링 되는 것을 확인할 수 있다. 앞으로 class에 따라 스타일을 변화시켜야 한다면, 위와 같이 작성할 수 있지 않을까 고민해보자.

# Day 06 - Type Ahead

## RegExp.replace()

input에 입력한 텍스트에 매치되는 문자열에 span 태그를 추가하여 하이라이트 효과를 주기 위해서 다음과 같은 코드를 작성했다.

```js
// fullName에 존재하는 keyword를 span 태그로 감싸줌.
const keywordPos = fullName.toLowerCase().indexOf(input.toLowerCase());
const keyword = fullName.substring(keywordPos, keywordPos + input.length);
const words = fullName.split(keyword);
const resultCityText = words.join(`<span class="hl">${keyword}</span>`);
```

위와 같은 코드는 keyword가 fullName에 대문자와 소문자가 섞여있는 형태로 있을 때, 둘다 태그를 붙이지 않게된다. 그리고 무엇을 하는 코드인지 파악하기가 힘든 문제도 있다. 이럴때 RegExp.replace()를 사용하면, 간단하게 문제를 해결할 수 있다.

```js
const regex = new RegExp(input, "gi");
const resultCityText = fullName.replace(regex, `<span class="hl">${input}</span>`);
```

코드가 2줄이 줄었는데, 읽기 쉬워졌고, 오류도 해결했다. 이처럼, 문자열을 가공하는 코드를 짜야할 때, 정규 표현식을 이용해보면 좋을 것 같다.

# Day 07 - Array Cardio Day 2

## 변수 이름과 함께 변수 출력하기

```js
console.log({ variable });
```

## Array.prototype.find()

find는 filter와 비슷하게 동작하나, 조건에 맞는 하나만을 리턴한다는 차이점이 있다.

```js
const comment = comments.find((comment) => comment.id === 823423);
// 이렇게 하면, id가 823423인 Object 하나만 리턴된다.
```

## Array.prototype.findIndex() vs Array.prototype.indexOf()

findIndex라는 메소드를 처음 봤을 때, inedxOf가 있는데 굳이 이걸 사용해야 할 이유를 느끼지 못했다. 그래서 추가적으로 찾아봤는데, indexOf는 number, string등이 들어가지만, findIndex는 메소드를 전달해서, 그 메소드가 true를 반환하는 요소를 반환해주는 것이다. 그래서 Array나 Object의 배열에서 특정 요소를 탐색할때 유용하게 사용할 수 있겠다.

```js
comments.findIndex((comment) => comment.id === 823423);
// 이걸 indexOf로 구현하긴 힘들어보인다..
```

# Day 08 - Fun with HTML5 Canvas

## 윈도우 크기

canvas의 크기를 사용자의 윈도우 창 크기에 딱맞도록 동적으로 크기를 변경하고 싶었다. 그럴 때 윈도우의 크기를 가져올 수 있는 메소드가 있다.

```js
window.innerWidth(); // 브라우저 화면의 너비
window.innerHeight(); // 브라우저 화면의 높이 (상단 탭 같은 것을 포함하지 않음)
window.outerWidth(); // 브라우저 전체의 너비
window.outerHeight(); // 브라우저 전체의 높이 (전체 다 포함)
```

## 마우스 좌표를 얻는 다양한 방법

마우스를 이용해서 그림을 그리기 위해 clientX와 clientY를 이용해 마우스 좌표를 얻어냈다. 그런데 나중에 예제코드를 보니, offsetX와 offsetY를 이용해 마우스 좌표를 얻어오고 있었다. 무슨 차이인가 궁금해서 검색해봤더니, 마우스 좌표를 얻는 방법이 4가지나 있었다. 간단히 정리해봤다.

### 1. clientX, clientY

클라이언트 영역에서의 좌표를 반환한다. 브라우저 화면이 기준이 된다.

### 2. offsetX, offsetY

이벤트 대상의 좌표를 기준으로한 좌표를 반환한다. 만약 canvas가 화면 전체를 차지하는 것이 아니라, 사이즈가 고정되있고, 가운데로 정렬을 해놨다면, offsetX와 offsetY를 이용해서 그림을 그려야, canvas의 좌표를 기준으로 하기 때문에 올바르게 그림이 그려지게 된다.

### 3. pageX, pageY

문서를 기준으로한 좌표를 반환한다. 그래서 아래로 스크롤을 내릴수록 pageY가 제공하는 값이 계속해서 커진다고 보면 된다. (X도 마찬가지!)

### 4. screenX, screenY

모니터 화면을 기준으로한 좌표를 반환한다. 예를 들어 내가 1920 x 1080 해상도의 모니터를 쓰고있으니까, screenX의 값의 범위는 0~1919가 되겠지?

# Day 09 - 14 Must Know Dev Tools Tricks

## 개발자 도구로 HTML 수정하기

개발자 도구의 Elements 탭에서, HTML 요소에 오른쪽 클릭을 하면, 유용한 메뉴들이 나온다.

1. 속성의 추가, 삭제
2. 텍스트 수정
3. HTML 통째로 수정
4. element의 복사, 삭제
5. 가리기
6. 상태 강제(hover같은 것들)
7. 해당 element를 조작하는 javascript 코드에 breakpoint 잡기

이외에도 많은 기능들이 있으니 한번 클릭해보자.

# Day 10 - Hold Shift and Check Checkboxes

## 체크박스 상태 읽기, 쓰기

checkbox.checked를 이용하면, checkbox가 체크되어있는지 확인할 수 있고(boolean임), 상태를 바꿔줄 수도 있다.

## MouseEvent.shiftKey

체크박스를 클릭할 때, shift 키가 눌려진 상태인지 확인하기 위해, 아래와 같은 코드를 작성했다.

```js
let isShiftPressed = false;
addEventListener("keydown", (e) => {
  if (e.key === "Shift") isShiftPressed = true;
});
addEventListener("keyup", (e) => {
  if (e.key === "Shift") isShiftPressed = false;
});
```

shift 키를 누르고 뗄 때마다, isShiftPressed의 값을 바꾸는 식으로 작성했다. 하지만 체크박스를 클릭할 때 받는 이벤트엔 shiftKey라는 속성이 있다.

```js
if (e.shiftKey) console.log("Shift key is pressed!!");
//shift key가 눌린 상태면 true여서 문구가 출력된다.
```

이외에도 altKey, ctrlKey가 있으니, 이를 활용하면 더이상 복잡하게 코드를 작성할 필요가 없겠다.

# Day 11 - Custom Video Player

## 특정 attribute를 가진 element 가져오기

id나 class 말고 특정 attribute를 기준으로 element를 가져올 수 있다.

```js
// data-skip attribute의 존재유무에 따라서
const skipBtns = document.querySelectorAll("[data-skip]");
// data-skip attribute의 존재유무 + 값에 따라서
const skipBtns = document.querySelectorAll("[data-skip='25']");
```

## 요소의 크기를 가져오는 다양한 방법

element의 너비를 얻기 위해 다음과 같은 코드를 작성했다.

```js
progress.width;
```

하지만 이는 잘못된 방법이다! width는 css에서 쓰는 속성이다. 그러므로 내가 의도한 코드는...

```js
progress.style.width;
```

하지만, 이렇게 하면 css에 정의된 width속성의 값을 얻을 뿐이라서, 원하는 값을 얻지 못할 가능성이 크다. 실제로 문서에 어떠한 크기로 나타나는지를 확인하고 싶다면, 사용할 수 있는 다양한 방법이 있다.

```js
div.offsetWidth; // margin 제외, border와 padding을 포함한 width를 제공
div.clientWidth; // border와 padding을 제외한 width를 제공
div.scrollWidth; // 스크롤 영역일때, 스크롤로 가려진 부분까지 포함한 width를 제공
```

추가로, getBoundingClientRect라는 메소드를 이용하면, DOMRect객체를 받아올 수 있는데, 여기서 제공하는 width와 height는 transform: translate같은 속성에 영향을 받은 후 최종적으로 렌더링된 element의 크기를 제공해준다.

```js
const rect = progress.getBoundingClientRect();
console.log(rect);
// {
//     "x": 130,
//     "y": 576.7999877929688,
//     "width": 640,
//     "height": 5,
//     "top": 576.7999877929688,
//     "right": 770,
//     "bottom": 581.7999877929688,
//     "left": 130
// }
```

## event callback function속 this

코드를 다 작성하고 정답코드를 확인했는데, 내가 e.target이라고 쓴 것과 달리 this를 사용해서 타깃의 속성에 접근하는 코드를 확인했다. 그걸 보고 내 코드도 this로 바꿔봤는데, 동일하게 동작하는 것을 확인했다. 검색해보니, event callback function에서 this는 currentTarget과 동일한 대상을 가리킨다는 것을 확인했다. 그런데, target과 currentTarget은 뭐가 다른걸까?

## target vs currentTarget

currentTarget은 이벤트 핸들러가 부착된 것을 가리킨다. 부모요소에 이벤트위임을 이용한 코드를 작성해 전달했다면, 부모가 currentTarget, 이벤트를 위임받는 자식이 target이 된다. 만약 event callback function안에서 this를 사용하려면, 이를 헷갈리지 않도록 조심해야겠다.

# Day 12 - Key Sequence Detection

## splice의 매개변수

강의를 보던중 이런 코드를 발견했다.

```js
pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
// splice(start, end);
```

무슨일을 하는 코드인지 이해하기 어려워서, splice의 매개변수에 대해 간단히 알아보고 위 코드가 어떻게 동작하게 되는지 이해했다.

secretCode.length = 6이라고 가정

1. start의 절댓값이 문자열의 길이와 같거나 크면 무시됨. 즉, pressed.length가 7이상일때 작동함.

2. start가 음수면, 배열 끝에서부터의 길이를 나타냄. pressed.length = 7인데 start가 7이라면, pressed의 시작부분이 된다.

3. pressed.length - secretCode.length가 1이 되므로, 뒤쪽의 secretCode.length만큼의 부분을 제외하고 전부 제거하는 코드가 된다.

# Day 13 - Slide in on Scroll

## 디바운스

프로젝트를 시작하려는데, debounce라는 함수가 기본적으로 제공되어있었다. 무슨일을 하는 함수인지 파악하기가 어려워서, 인터넷에 검색해봤다. 디바운싱: 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것이라고 한다. 이 정의를 토대로 제공된 debounce함수를 분석해봤다.

```js
// 함수, 연이어 호출로 감지하기 위한 시간 간격, 연이어 호출되는 함수들중 처음을 호출할지 마지막을 호출할지를 인자로 받는다.
function debounce(func, wait = 20, immediate = true) {
  var timeout; // 클로저를 이용해 setTimeout의 id를 계속해서 이용할 수 있게함.
  return function () {
    // 내가 전달한 함수대신 이 함수가 호출될 것임.
    var context = this,
      args = arguments; // 함수가 호출된 곳의 this와 받은 인자들을 저장함.
    var later = function () {
      // 시간간격(20ms)가 지날동안 함수가 다시 호출되지 않았다면 마지막에 호출되는 함수.
      timeout = null; // timeout을 clear하고, immediate를 false로 했다면, 마지막에 내가 전달했던 함수가 실행됨.
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout; // immediate가 true라는 것은 함수를 즉시 호출하도록 인자를 전달한 것이고, timeout이 false라는 것은 연이어 호출되고 있지 않음을 나타낸다.
    clearTimeout(timeout); // timeout을 clear하고, 새로 건다
    timeout = setTimeout(later, wait); // 이것으로, 내가 전달한 wait만큼의 시간간격안에 이 함수가 다시 실행되면, later가 실행되지 않고, timeout이 다시 걸린다.
    if (callNow) func.apply(context, args); // immediate가 true이고, 연이어 호출되고있지 않은 상황이었다면 내가 전달한 함수를 실행.
  };
}
```

이해하기 어려웠지만, 한줄씩 잘 분석해보니 무슨일을 하는 함수인지 이해할 수 있었다.  
이제 window 객체에 scroll 이벤트리스너를 등록할 때, debounce를 이용해 등록해봤다.

```js
window.addEventListener("scroll", debounce(toggleSlide, 20, false));
// 스크롤이 끝난 후에 함수를 실행시키기위해 3번째 인자를 false로 전달함.
```

console.count()를 이용해 페이지 끝까지 스크롤했을때, 이벤트가 불리는 횟수를 세어보았더니, debounce를 사용하지 않았을 때는 443회, debounce를 사용했을 때는 11회로 급격하게 감소했고, 거의 동일한 사용자 경험을 제공할 수 있었다. 비슷한 역할을 하는 프로그래밍 기법중엔 쓰로틀링도 있다. 쓰로틀링은 함수가 호출된 후 일정시간동안 다시 호출되지 않도록 하는 기법이다. 이 내용들을 이해하는데 [제로초님의 블로그](https://www.zerocho.com/)의 두 포스트가 큰 도움이 되었다.  
https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa
https://www.zerocho.com/category/JavaScript/post/57433645a48729787807c3fd

# Day 14 - JavaScript References VS Copying

## 배열 복사

배열을 복사하는 다양한 방법이 있다. 어느 방법이 성능면에서 제일 나을지 궁금해 측정해봤다.

```js
const newArr1 = arr.slice(0);
const newArr2 = [].concat(arr);
const newArr3 = [];
for (let i = 0; i < 100000000; i++) newArr3.push(arr[i]);
const newArr4 = [...arr];
const newArr5 = Array.from(arr);
// slice: 349.708ms
// concat: 294.534ms
// for loop: 1.282s
// spread: 277.369ms
// Array.from: 279.875ms
```

for loop는 아마도 push를 써서 느린 것 같다. 큰 차이는 없어보이니 난 spread 연산자를 사용할 것 같다.

## object 복사

아래는 object를 복사하는 대표적인 2개의 방법이다.

```js
const person2 = { ...person, age = 11 }; // 두 방법모두 뒤에 추가적인 property를 붙일 수 있다.
const person3 = Object.assign({}, person, {age = 11});
```

## 깊은 복사?

지금까지 소개했던 방법들은 전부 얕은 복사를 제공한다. 그말인 즉슨 배열이나 object의 1차적인 데이터까지만 복사해주기 때문에, 만약에 reference가 한번 더 있다면(object 안에 object같은 것), 그 reference가 가리키는 안쪽의 데이터는 완전히 복사되지 못하고 원본과 공유하게 된다는 이야기이다. 데이터 자체를 통째로 복사하여, 완전히 독립된 메모리를 갖도록 깊은복사를 하려면 어떻게 해야할까?

### JSON 객체 이용하기

```js
const copied = JSON.parse(JSON.stringify(obj));
```

이 방법은 사용하기 간편하나, 속도가 아주 느리고, JSON에서 날려버리는 undefined와 function까지 복사하는 것은 불가능하다.

위의 단점들이 신경쓰인다면, 직접 구현하거나 lodash 라이브러리의 cloneDeep을 사용해야 겠다.

# Day 15 - LocalStorage

## localStorage

localStorage는 브라우저에 키-값 쌍을 저장할 수 있게 해주는 객체이다. 비슷한 객체로 sessionStorage가 있지만, 브라우저를 다시 실행하면 사라지기 때문에, localStorage가 자주 이용된다고 한다. localStorage는 페이지를 새로 고침하거나, 브라우저를 다시 실행해도 데이터가 사라지지 않고 유지된다. localStorage를 사용하는 방법을 알아보자.

### 문법

```js
// 데이터를 저장하는 3가지 방법
localStorage.someKey = "some value";
localStorage["someKey"] = "some value";
localStorage.setItem("someKey", "some value");

// 데이터를 얻는 3가지 방법
let value = localStorage.someKey;
let value = localStorage["someKey"];
let value = localStorage.getItem("someKey");

// 아이템 삭제
localStorage.removeItem(key);
// 아이템 전체 삭제
localStorage.clear();
// 순회하는 방법
localStorage.key(index); // index에 해당하는 key를 받아옴.
localStorage.length; // 저장된 데이터의 길이를 받아옴.
```

### Object를 저장하는 법

localStorage의 value는 문자열이기 때문에, Object를 아무런 처리없이 localStorage에 저장하면, 자동으로 toString()으로 변환된 문자열이 들어가기 때문에, Object에 있었던 모든 정보가 제거된 채로 저장된다. 이를 막기 위해 JSON.stringify를 이용해 문자열로 Object를 변환해준 후에 localStorage에 저장하도록 하자.

```js
localStorage[i] = JSON.stringify(item);
```

## javascript에서 form 요소 사용하기

### submit event, preventDefault

submit event는 form 요소에서 사용자가 enter를 누르거나 submit역할을 하는 button, input을 클릭할때 일어난다. form 요소는 원래 서버에 데이터를 보내거나 요청하는 역할을 하기 때문에, submit event가 일어날 때마다 페이지가 새로고침된다. 이는 원하는 동작이 아니므로, 이를 방지하기 위해서 e.preventDefault()를 이용하자.

```js
someForm.addEventListener("submit", (e) => {
  // preventDefault를 호출하면 form 태그의 고유한 동작(서버로 데이터보내고 새로고침등)을 막는다.
  e.preventDefault();
});
```

### reset

유저가 form의 text input에 텍스트를 입력하고, submit해서 item을 추가한 후, text input을 초기화시키기 위해 e.target.value = ""을 사용했다. 비슷한 역할을 하는 메소드인 reset이 있다. reset은 form속 요소들의 값을 기본값으로 초기화한다.

```js
document.getElementById(".myform").reset();
```

## Element.matches()

예시 코드의 이벤트 위임을 이용한 코드에서, 특정 태그를 걸러내기 위해 matches메소드를 이용했다. matches는 특정 element가 인자로 제공한 선택자(문자열)에 의해 선택되는지를 boolean으로 반환하는 메소드이다.

```js
// 내가 작성한 코드
e.target.tagName !== "INPUT";
// matches를 이용한 코드
!e.target.matches("input");
```

matches를 이용하면, 기존의 이벤트 위임을 이용하는 코드에서, target을 걸러낼때 tagName이나 classList등을 사용했던 것을 대체할 수 있을 것 같다.

# Day 16 - Mouse Move Shadow

## Object Destructuring Assignment

객체에서 여러개의 property를 변수에 저장할때, Destructuring Assignment를 사용하면 코드를 줄일 수 있다.

```js
// 객체에 변수명과 똑같은 property가 있는지 찾아보고, 대입한다.
// hero.offsetWidth와 hero.offsetHeight를 각각 offsetWidth와 offsetHeight에 할당함.
const { offsetWidth, offsetHeight } = hero;
// hero.offsetWidth와 hero.offsetHeight를 각각 width와 height에 할당함.
const { offsetWidth: width, offsetHeight: height } = hero;
```

# Day 17 - Sort Without Articles

## 정규식으로 특정 단어 제거하기

예제 코드에서 a, an, the를 제거하기 위해 이런 코드를 사용했다.

```js
bandName.replace(/^(a |the |an )/i, "");
```

이렇게 코드를 작성하면, 시작지점에 있는 a나 the나 an을 제거한다.  
나는 코드를 이렇게 작성했다.

```js
s.replace(/(\bThe\b|\bAn\b|\bA\b)/gi, "");
```

이렇게 쓰면 the, an, a 한 단어를 전부 제거한다.

# Day 18 - Adding Up Times with Reduce

## string과 number의 연산의 결과 타입

비디오의 시간 정보를 초단위로 변환하기위해 다음과 같은 코드를 작성했다.

```js
sum += min * 60 + second;
```

하지만, min과 second의 type이 string이여서, 둘의 덧셈이 아니라 가로로 이어붙인 문자열이 결과값으로 나오는 의도치 않은 결과가 발생했다. 그래서 아래와 같이 코드를 수정하니 정상 동작했다.

```js
sum += min * 60 + Number(second);
```

이렇게 코드를 작성했는데, string과 number의 연산에서 연산자에 따라 어떤 결과 type이 나오는지 궁금해졌다. 검색해보니 string + number일때만 결과type이 string이고, 나머지 -, \*, /, %는 number가 결과로 나오는 것을 확인할 수 있었다.  
추후에 헷갈릴때 보기위해 찾은 표를 첨부한다.

```
╔═════════════╦═══════════╦════════╗
║ INPUT       ║ VALUE     ║ TYPEOF ║
╠═════════════╬═══════════╬════════╣
║ n           ║ 11.5      ║ number ║
║ s           ║ -1.5      ║ string ║
║ s - 0       ║ -1.5      ║ number ║
║ n + s - 0   ║ NaN       ║ error  ║
║ n + (s - 0) ║ 10        ║ number ║
║ s + 0       ║ -1.50     ║ string ║
║ n + s + 0   ║ 11.5-1.50 ║ string ║
║ n + (s + 0) ║ 11.5-1.50 ║ string ║
║ n + s       ║ 11.5-1.5  ║ string ║
║ s + n       ║ -1.511.5  ║ string ║
║ +s + n      ║ 10        ║ number ║
║ n + +s      ║ 10        ║ number ║
║ n++s        ║           ║ error  ║
║ n+(+s)      ║ 10        ║ number ║
║ Number(s)+n ║ 10        ║ number ║
╚═════════════╩═══════════╩════════╝
```

# Day 19 - Webcam Fun

## 웹캠 api

다음과 같은 코드로 사용자에게 미디어 입력 장치 사용 권한을 요청하고, 수락되면 스트림 자원을 반환한다.

```js
navigator.mediaDevices.getUserMedia({ video: true, audio: false });
```

위의 코드는 MediaStream객체로 이행하는 promise라고 한다. then으로 MediaStream객체를 받아서 video.srcObject에 대입해준 후 video.play()를 하면 비디오가 스트리밍된다!

## video event

video로부터 canvas에 그려진 이미지에 다양한 효과를 주기 위해 16ms마다 canvas의 데이터를 뽑아 변형한후 다시 canvas에 그려주는 함수를 작성했고, 웹캠이 인식되서 재생이 시작된 후에 위의 함수를 호출하려 했다. 정확히 웹캠에 관련된 자원을 다 얻고 재생하기 시작하는 시점에 위의 함수를 호출하려면 getUserMedia의 then에서 함수를 호출했지만, video의 width가 0이라는 오류가 발생했다. 아마 video.play()를 한다고 해서 바로 재생이 시작되는게 아닌 것 같았다. 이를 해결하기 위해서 video가 발생시키는 event를 사용할 필요가 있었다. video의 canplay event는 비디오가 재생시작 가능한 상태일때 발생하는 이벤트이다.

```js
video.addEventListener("canplay", paintVideoToCanvas);
```

이렇게 작성하니 아까 언급한 오류는 발생하지 않았다. navigator.mediaDevices.getUserMedia가 반환한 promise에 callback function을 연결했는데.. callback function이 불려지는 시점이 비디오가 play가능한 시점이 아니었던걸까? 추후에 조금더 알아봐야겠다..

## canvas로부터 image 얻기, image를 canvas에 그리기

canvas에 그림을 그리고, 이미지의 형태로 그것을 얻고, 변환하기 위해 다음과 같은 canvas의 api들을 이용할 수 있다.

```js
ctx.drawImage(video, 0, 0, width, height);
let pixels = ctx.getImageData(0, 0, width, height);
// pixels를 변형
ctx.putImageData(pixels, 0, 0);
```

## image download link 만들기

a 태그에 download속성이 있다면 다운로드 링크가 만들어진다.

```js
// 이렇게 생성된 링크를 클릭하면 someImage.jpg가 다운로드 된다.
<a href="somePath/someImage.jpg" download></a>;
// downolad속성의 값은 파일을 어떤 이름으로 저장할지 설정하는 것이다.
link.setAttribute("download", "handsome"); // handsome.jpg
```

그렇다면, 지금 canvas에 그려져있는 그림을 어떻게 url로 변환해서 href의 값으로 줄 수 있을까?

```js
const data = canvas.toDataURL("image/jpeg");
link.href = data;
```

# Day 20 - Speech Detection

## SpeechRecognition

SpeechRecognition은 Web Speach API의 인터페이스이다. [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)에 잘 설명되어 있으므로, 여기엔 이번 프로젝트에서 사용했던 기능만 정리해보겠다.

### property

```js
// interimResults는 음성이 끝났는지 여부를 데이터에 같이 반환할지 여부이다.
recognition.interimResults = true;
// 언어를 설정하는 곳이다. 혹시해서 ko로 해봤는데 아주 잘된다.
recognition.lang = "ko";
```

### event

```js
// 음성인식의 결과가 나올 때마다 result 이벤트가 발생한다.
recognition.addEventListener("result", (e) => {});

// recognition.start는 음성인식을 시작하는 메서드이다.
// end 이벤트는 음성인식이 끝난 후 발생하는 이벤트이다.
// 음성인식이 끝나면, 다시 음성인식을 시작해 웹페이지가 켜져있는 동안
// 계속해서 음성인식을 하도록 하기위해 아래의 코드를 사용했다.
recognition.addEventListener("end", recognition.start);
```

### 결과 받아보기

```js
// 결과를 받을 때 마다 실행하도록 이벤트리스너 등록
recognition.addEventListener("result", (e) => {
  // 결과!
  console.log(e.results);

  // results는 길이 1인 배열과 isFinal정보를 담고있는 result들로 이루어져있음
  // 0번째 데이터의 transcript로 전부 변환한다음에 합친다.
  const transcript = Array.from(e.results)
    .map((result) => result[0].transcript)
    .join("");

  // 결과문장 출력
  console.log(transcript);

  if (e.results[0].isFinal) {
    // 정보에 음성인식이 끝났는지가 같이 오기때문에, 끝난 후 추가적으로 뭔가 할 수 있다.
  }
});
```

# Day 21 - Geolocation

## navigator

저번 웹캠편에 이어서 navigator라는 키워드가 또 등장했다. Navigator 인터페이스는 사용자 에이전트의 상태와 신원 정보를 나타내며, 스크립트로 해당 정보를 질의할 때와 애플리케이션을 특정 활동에 등록할 때 사용된다고 한다. 저번 웹캠편에서 처럼 미디어 접근을 요청하고, 관련 자원을 가져오거나, 이번 프로젝트처럼 장치의 위치 정보에 접근할 수 있는 객체를 받아올 수 있고, 이 외에도 장치의 네트워크 연결 정보를 가져오거나, 사용자의 선호 언어를 가져오는등 다양하고 유용한 정보를 받아올 수 있다. [MDN문서](https://developer.mozilla.org/ko/docs/Web/API/Navigator)에서 더 자세하게 알아볼 수 있겠다.

## geolocation

다음으로 navigator로 받을 수 있는 Geolocation 객체에 대해 알아보자.

### Geolocation 객체 받아오기

```js
// Navigator는 기본적으로 존재하는 전역 객체로서, 따로 생성할 필요가 없다.
// 아래 코드로 geolocation객체를 읽기 전용으로 받아올 수 있다.
navigator.geolocation;
```

### Geolocation 객체로 다양한 정보 얻어내기

geolocation 객체가 제공하는 메서드를 사용하면, GeolocationPosition 객체를 받을 수 있다.

```js
Geolocation.getCurrentPosition(); // 장치의 현재 위치를 조사한 후 GeolocationPosition 반환
Geolocation.watchPosition(); // 장치의 위치가 바뀔때마다 호출하는 콜백을 등록.
// 콜백함수의 인자로 GeolocationPosition을 받을 수 있다.
```

GeolocationPosition 객체 안에 있는 coords라는 또다른 객체에 다양한 정보가 저장되어있다. 장치의 위도, 경도, 방향, 속력등의 정보를 얻을 수 있다.

```js
navigator.geolocation.watchPosition((data) => {
  const latitude = data.coords.latitude;
  const longitude = data.coords.longitude;
  const speed = data.coords.speed;
  const heading = data.coords.heading;
});
```

# Day 22 - Follow Along Link Highlighter

## mouseover vs mouseenter

마우스가 링크에 올라갔을때 발생하는 이벤트가 필요했기 때문에, 검색해보니 두가지가 있었다. 차이점을 찾아보니, mouseover는 버블링이 일어나고, mouseenter는 그렇지 않다는 것이었다. 이벤트 위임을 이용한 코드를 작성할땐 mouseover를 이용하고, 아니면 mouseenter를 이용하면 될 것 같다.

## getBoundingClientRect가 제공하는 좌표

getBoundingClientRect의 x와 y는 브라우저 화면 기준이다. highlight의 위치 이동을 위해 transform: translate()를 사용했고, getBoundingClientRect로 얻은 x와 y를 사용했다. 그런데 스크롤을 내리고 작동시키니 두 좌표가 일치하지 않는다는 것을 알아냈다. highlight는 position: absolute, top: 0, left: 0으로 설정되어 있었기 때문에, 문서 기준으로 움직이고, getBoundingClientRect는 브라우저 화면 기준이기 때문에, 서로 맞지 않았던 것이다. scrollY를 더해주니 해결됬다.

# Day 23 - Speech Synthesis

## speechSynthesis

speechSynthesis는 Web Speech API의 인터페이스이다. 음성인식 프로젝트에선 SpeechRecognition을 사용했고, 이번엔 SpeechSynthesis를 이용하여 SpeechSynthesisUtterance를 재생한다.

```js
// 재생
speechSynthesis.speak(utterance);
// 종료
speechSynthesis.cancel();
```

## SpeechSynthesisUtterance

SpeechSynthesisUtterance는 읽을 텍스트와, 어떻게 읽을지(언어, 피치, 속도등)를 나타내는 객체이다.

```js
const utterance = new SpeechSynthesisUtterance();
// 읽을 텍스트 설정
utterance.text = "I love JavaScript 👍";
// 속도 설정
utterance.rate = 1.5;
// 피치 설정
utterance.pitch = 1.5;
// 재생
speechSynthesis.speak(utterance);
```
