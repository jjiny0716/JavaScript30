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

마우스를 이용해서 그림을 그리기 위해 clientX와 clientY를 이용해 마우스 좌표를 얻어냈다. 그런데 나중에 정답을 보니, offsetX와 offsetY를 이용해 마우스 좌표를 얻어오고 있었다. 무슨 차이인가 궁금해서 검색해봤더니, 마우스 좌표를 얻는 방법이 4가지나 있었다. 간단히 정리해봤다.

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
