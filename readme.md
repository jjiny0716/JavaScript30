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
2. transition: cubic-bezier나 display: flex옆에 뜨는 아이콘을 클릭하면 나오는 gui로 속성값을 바꿔볼 수 있음.
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
