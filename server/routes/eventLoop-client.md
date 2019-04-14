####只是进行了整理。
参考文档
[浏览器与Node的事件循环(Event Loop)有何区别?](https://blog.csdn.net/Fundebug/article/details/86487117)
[事件循环机制EventLoop](https://www.jianshu.com/p/c3716bedfaae)
[JavaScript：event loop详解 ](https://www.cnblogs.com/yanchenyu/p/8446119.html)

#eventLoop 相关的概念
![heap-stack](https://upload-images.jianshu.io/upload_images/15586502-e7b7ddcc99814913.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/295)

###堆（Heap）
堆表示一大块非结构化的内存区域，对象被存放在堆中.
###栈（stack)
栈在`javascript`中又称执行栈，调用栈，是一种后进先出的数组结构，调用栈(或执行栈`call-stack`)，主线各所有的任务都会被放到调用栈等待主线程执行。
`JS`调用栈采用的是后进先出的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。

举个例子：
```javascript
    function foo(b) { 
        var a = 10; 
        return a + b + 11;
    } 
    
    function bar(x) {
        var y = 3; 
        return foo(x * y); 
    } 
    console.log(bar(7)); // 返回 42
```
当调用` bar` 时，创建了第一个帧 ，帧中包含了` bar` 的参数和局部变量。当 `bar` 调用 `foo` 时，第二个帧就被创建，并被压到第一个帧之上，帧中包含了` foo` 的参数和局部变量。当 `foo `返回时，最上层的帧就被弹出栈（剩下 `bar `函数的调用帧 ）。当 `bar` 返回的时候，栈就空了。
 这里的堆栈，是数据结构的堆栈，不是内存中的堆栈（内存中的堆栈，堆存放引用类型的数据，栈存放基本类型的数据）

# 队列 （quene）
队列即任务队列`Task Queue`，是一种先进先出的一种数据结构。在队尾添加新元素，从队头移除元素。
![quene](https://upload-images.jianshu.io/upload_images/15586502-a6e47634fc2cfca3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/576)

#浏览器内核
简单来说浏览器内核是通过取得页面内容、整理信息（应用 `CSS`）、计算和组合最终输出可视化的图像结果，通常也被称为渲染引擎。
浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：
```
——|GUI 渲染线程
——|JavaScript 引擎线程
——|定时触发器线程
——|事件触发线程
——|异步 http 请求线程
```
#####1.`GUI`渲染线程
* 主要负责页面的渲染，解析 `HTML`、`CSS`，构建` DOM `树，布局和绘制等。  
* 当界面需要重绘或者由于某种操作引发回流时，将执行该线程。
* 该线程与` JS` 引擎线程互斥，当执行` JS` 引擎线程时，`GUI `渲染会被挂起，当任务队列空闲时，`JS `引擎才会去执行` GUI `渲染。
#####2. JS 引擎线程
* 该线程当然是主要负责处理 `JavaScript` 脚本，执行代码。
* 也是主要负责执行准备好待执行的事件，即定时器计数结束，或者异步请求成功并正确返回时，将依次进入任务队列，等待` JS` 引擎线程的执行。
* 当然，该线程与` GUI `渲染线程互斥，当 `JS` 引擎线程执行 `JavaScript` 脚本时间过长，将导致页面渲染的阻塞。
#####3. 定时器触发线程
* 负责执行异步定时器一类的函数的线程，如： `setTimeout`，`setInterval`。
* 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计时完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待` JS `引擎线程执行。
#####4. 事件触发线程
* 主要负责将准备好的事件交给 `JS` 引擎线程执行。
比如 `setTimeout` 定时器计数结束， `ajax` 等异步请求成功并触发回调函数，或者用户触发点击事件时，该线程会将整装待发的事件依次加入到任务队列的队尾，等待` JS `引擎线程的执行。
#####5. 异步 http 请求线程
* 负责执行异步请求一类的函数的线程，如： Promise，axios，ajax 等。
* 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待 JS 引擎线程执行。

#浏览器的事件循环机制
####1. Micro-Task 与 Macro-Task
* 事件循环中的异步队列有两种：`macro`（宏任务）队列和` micro`（微任务）队列。***宏任务队列可以有多个，微任务队列只有一个。***

* 常见的 `macro-task` 比如：`setTimeout`、`setInterval`、 `setImmediate`、`script`（整体代码）、 `I/O` 操作、`UI` 渲染等。

* 常见的 `micro-task `比如: `process.nextTick`、`new Promise().then`(回调)、`MutationObserver`(`html5` 新特性) 等。
####2. Event Loop 过程解析
一个完整的 `Event Loop `过程，可以概括为以下阶段：
![eventLoop](https://image.fundebug.com/2019-01-14-002.png)

* 一开始执行栈空,我们可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。`micro `队列空，`macro `队列里有且只有一个 `script` 脚本（整体代码）。
* 全局上下文（`script` 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的 `macro-task `与 `micro-task`，它们会分别被推入各自的任务队列里。同步代码执行完了，`script` 脚本会被移出 `macro` 队列，这个过程本质上是队列的 `macro-task` 的执行和出队的过程。

上一步我们出队的是一个 `macro-task`，这一步我们处理的是 `micro-task`。但需要注意的是：当 `macro-task `出队时，任务是一个一个执行的；而 `micro-task `出队时，任务是一队一队执行的。因此，我们处理 `micro` 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。
* 执行渲染操作，更新界面
* 检查是否存在 `Web worker `任务，如果有，则对其进行处理
* 上述过程循环往复，直到两个队列都清空

我们总结一下，每一次循环都是一个这样的过程：
![The flow chart
](https://image.fundebug.com/2019-01-14-003.png)
当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。

*接下来我们看道例子来介绍上面流程：*
```javascript
    Promise.resolve().then(()=>{
  console.log('Promise1')
  setTimeout(()=>{
    console.log('setTimeout2')
  },0)
})
setTimeout(()=>{
  console.log('setTimeout1')
  Promise.resolve().then(()=>{
    console.log('Promise2')
  })
},0)
```
**调用栈的执行顺序是后进先出**
最后输出结果是 `Promise1`，`setTimeout1`，`Promise2`，`setTimeout2`

* 一开始执行栈的同步任务（这属于宏任务）执行完毕，会去查看是否有微任务队列，上题中存在(有且只有一个)，然后执行微任务队列中的所有任务输出 `Promise1`，同时会生成一个宏任务 `setTimeout2`
* 然后去查看宏任务队列，宏任务 `setTimeout1` 在 `setTimeout2` 之前，先执行宏任务 `setTimeout1`，输出 `setTimeout1`
* 在执行宏任务 `setTimeout1` 时会生成微任务 `Promise2` ，放入微任务队列中，接着先去清空微任务队列中的所有任务，输出` Promise2`

* 清空完微任务队列中的所有任务后，就又会去宏任务队列取一个，这回执行的是 `setTimeout2`

#源码分析浏览器的事件循环机制
```javascript
    eventLoop = {
    taskQueues: {
        events: [], // UI events from native GUI framework
        parser: [], // HTML parser
        callbacks: [], // setTimeout, requestIdleTask
        resources: [], // image loading
        domManipulation: []
    },
 
    microtaskQueue: [
    ],
 
    nextTask: function() {
        // Spec says:
        // "Select the oldest task on one of the event loop's task queues"
        // Which gives browser implementers lots of freedom
        // Queues can have different priorities, etc.
        for (let q of taskQueues)
            if (q.length > 0)
                return q.shift();
        return null;
    },
 
    executeMicrotasks: function() {
        if (scriptExecuting)
            return;
        let microtasks = this.microtaskQueue;
        this.microtaskQueue = [];
        for (let t of microtasks)
            t.execute();
    },
 
    needsRendering: function() {
        return vSyncTime() && (needsDomRerender() || hasEventLoopEventsToDispatch());
    },
 
    render: function() {
        dispatchPendingUIEvents();
        resizeSteps();
        scrollSteps();
        mediaQuerySteps();
        cssAnimationSteps();
        fullscreenRenderingSteps();
 
        animationFrameCallbackSteps();
 
        intersectionObserverSteps();
 
        while (resizeObserverSteps()) {
            updateStyle();
            updateLayout();
        }
        paint();
    }
}
 
while(true) {
    task = eventLoop.nextTask();
    if (task) {
        task.execute();
    }
    eventLoop.executeMicrotasks();
    if (eventLoop.needsRendering())
        eventLoop.render();
}
```

事件循环并没有多说关于什么时候`dispatch event`：
1，每一个`queue`（队列）中的事件都是按顺序执行；
2，事件可以直接`dispatch`，绕过`task queues`（任务队列）
2，微任务是在一个`task`执行完成后立即执行；
3，渲染部分循环是在`vSync`上执行，并且按以下顺序传递事件：
1️⃣分派待处理的`UI`事件，
2️⃣`resize`事件，
3️⃣`scroll`滚动事件，
4️⃣`mediaquery`监听者（`css @media`），5️⃣`CSSAnimation`事件，
6️⃣`Observers`，
7️⃣`requestAnimationFrame`

下面来详细说一下
 
`UI events`有两类：
* `Discrete`，俗称离散事件，就是那些不连续的，比如（`mousedown`，`mouseup`，`touchstart`，`touchend`）等
* `Continuous`，俗称连续事件，就是连续的，比如（`mousemove`，`mousewheel`，`touchmove`，`wheel`）等
两种事件的注意点不同：
* 连续事件：一个`UI event task queue`中，相匹配的连续事件（比如持续更新`position`属性，或者持续改变大小），可能会合并，不管那些合并的事件是否被`dispatch`了，因为有的还没有被`dispatch`，或者排在了队列的后面。
* 离散事件：如果从硬件接收到了离散事件，就必须尽快`dispatch`，如果此时队列中有连续事件，就必须立即运行所有的连续事件，以防止离散事件的延迟。也就是说，触发离散事件的时候，连续事件必定已经全部`dispatch`完毕。

不同的浏览器对事件循环的顺序是不同的，我还是习惯以谷歌为准，因为谷歌浏览器是最接近规范的
下面列举一些谷歌`dispatch event`是通过哪些方法来`dispatch`的：
1. `DOMWindowEventQueue`
由计时器触发
示例事件：`window.storage`，`window.hashchange`，`document.selectionchange`
2. `ScriptedAnimationController`
由`Frame`调用的`BeginMainFrame`函数触发，同时还管理`requestAnimationFrame`请求
示例事件：`Animation.finish`，`Animation.cancel`，`CSSAnimation.animationstart`，`CSSAnimation.animationiteration`（`CSSAnimation`）
3. `Custom dispatch`
触发器不同：`OS events`操作系统事件，`timers`定时器，文档/元素生命周期事件
`Custom dispatch event` 不通过队列，他们直接被触发（这里我猜想可能就是‘任务队列’的隐藏概念，他们不会排在普通队列中，而是单独去了另一个特殊的队列执行，这里就是‘任务队列’）
4. `Microtask`队列
微任务通常由`EndOfTaskRunner.didProcessTask()`触发，任务由`TaskQueueManager`运行，每当`task`完成时，微任务队列就会执行
示例事件：`image.onerror`，`image.onload`
微任务也包括`Promise callbacks`，这里注意，`Promise`的回调才是真正的微任务，之前说的可能不严谨，执行`promise`的时候本身还是正常`task`
5. 主线程事件队列
连续事件会被合并处理。
 
关于`Timer`有几个方法：
`requestIdleCallback`
这个方法只有浏览器空闲的时候才会有内部的`timer`触发
`requestAnimationFrame`
由`ScriptedAnimationController`触发，这个方法挺重要的，主要是用来解决`setTimeout`和`setInterval`无法完成的动画效果。
`Timers：setTimeout，setInterval`
由运行在`TaskQueue primitive`上的`WebTaskRunner`触发的。
 
#####Observers
观察者分为两种，`MutationObserver`和`IntersectionObserver`。
`MutationObserver`：属于微任务，主要是负责监听`DOM`节点内的变化，前一篇随笔里有提到；
`IntersectionObserver`：属于轮询，可以异步监听目标元素与其祖先或视窗(`viewport`)交叉状态的手段。具体用法不多介绍，不过它可以用来实现懒加载、无限滚动，监听元素是否在视窗中，或者已经出现了多少内容。
 
`Promises`
执行完成后，回调会放到微任务队列中去。
 
以上就是`event loop`的全部相关内容。


