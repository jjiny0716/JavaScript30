﻿# JavaScript30

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