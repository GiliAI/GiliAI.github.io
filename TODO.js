var initX;
var initY;
var moveX
var X=0;
var objX=0;
var timer;
var type="all";
var todoLeft=new Array();
var todoCompleted=new Array();
var storage=window.localStorage;
var timeOutEvent=0;
//绑定事件
window.onload=function(){
    getElements();
    document.getElementById("addButton").onclick=addButton;
    document.getElementById("manageButton").onclick=manageButton;
    document.getElementById("completeAll").onclick=completeAll;
    var selectLabels=document.querySelectorAll(".showType");
    for(let i=0;i<selectLabels.length;i++)
    {
        selectLabels[i].addEventListener("click",selectLabel);
    }
    this.addEventListener("touchstart",touchStart);
    document.body.addEventListener('touchmove', function (event) {
        event.preventDefault();}, true);
    //this.addEventListener("click",deleteBtn);
    this.addEventListener("keyup",keyUp);
    updateCount();
    updateTodoList(type);
}

//添加回车事件
function keyUp(event){
    if(document.getElementById("input-box").value!=""&&event.keyCode==13)
    {
        addButton();
    }
}
//添加待办事项按钮
function addButton(){
    var value=document.getElementById("input-box").value;
    if(value=="")
    {
        return;
    }
    todoLeft.unshift(value);
    //addTodoItem(value);
    updateCount();
    updateTodoList(type);
    updateStorate();
}
//添加对应待办事项
function addTodoItem(value)
{
    var li=document.createElement("li");
    li.classList.add("list-li");
    //li.innerHTML=value;

    //添加代办事件
    var text=document.createElement("div");
    text.classList.add("con");
    text.innerHTML=value;
    li.appendChild(text);
    // text.oncontextmenu=updateLi;
    text.onblur=finishUpdate;
    text.addEventListener("touchstart",updateTouchStart);
    text.addEventListener("touchmove", updateTouchMove);
    text.addEventListener("touchend", updateTouchEnd);

    //添加删除按钮
    var deleteBtn=document.createElement("div");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML="删除";
    deleteBtn.addEventListener("click",deleteClick);
    //deleteBtn.onclick=deleteClick(deleteBtn);
    li.appendChild(deleteBtn);

    var parentNode=document.getElementById("todo-list");
    parentNode.insertBefore(li,parentNode.children[0]);
    document.getElementById("input-box").value="";
}
//添加对应已办事项
function addCompletedItem(value)
{
    var li=document.createElement("li");
    li.classList.add("list-li");
    li.classList.add("completed");
    //li.innerHTML=value;

    //添加代办事件
    var text=document.createElement("div");
    text.classList.add("con");
    text.innerHTML=value;
    li.appendChild(text);

    var recoverBtn=document.createElement("div");
    recoverBtn.classList.add("recover-btn");
    recoverBtn.innerHTML="恢复";
    recoverBtn.addEventListener("click",recoverClick);
    li.appendChild(recoverBtn);

    var deleteBtn=document.createElement("div");
    deleteBtn.classList.add("com-delete-btn");
    deleteBtn.innerHTML="删除";
    deleteBtn.addEventListener("click",deleteClick);
    li.appendChild(deleteBtn);

    var parentNode=document.getElementById("todo-list");
    parentNode.appendChild(li);
}
//管理按钮
function manageButton(){
    var li_list=document.querySelectorAll(".con");
    var manageBtn=document.getElementById("manageButton");
    if(manageBtn.value=="完成")
    {
        document.getElementById("input-box").removeAttribute("disabled");
        document.getElementById("addButton").removeAttribute("disabled");
        var selectLabels=document.querySelectorAll(".showType");
        for(let i=0;i<selectLabels.length;i++)
        {
            selectLabels[i].addEventListener("click",selectLabel);
        }
        for(let i=0&&li_list.length>0;i<li_list.length;i++)
        {
            let tempLi=li_list[i];
            tempLi.removeChild(tempLi.firstChild);
        }
        manageBtn.value="管理";

        var deleteBtn=document.getElementById("deleteButton");
        var input=document.getElementById("selectAll");
        deleteBtn.remove();
        input.remove();
    }
    else
    {
        document.getElementById("input-box").setAttribute("disabled","disabled");
        document.getElementById("addButton").setAttribute("disabled","disabled");
        var selectLabels=document.querySelectorAll(".showType");
        for(let i=0;i<selectLabels.length;i++)
        {
            selectLabels[i].removeEventListener("click",selectLabel);
        }
        for(let i=0;i<li_list.length;i++)
        {
            let tempLi=li_list[i];
            var input = document.createElement("input");
            input.setAttribute("type","checkbox") ;
            input.setAttribute("name","list_li") ;
            input.setAttribute("value", i) ;
            input.classList.add("checkbox");
            input.onclick=updateCount;

            tempLi.insertBefore(input,tempLi.firstChild);
        }
        manageBtn.value="完成";

        var deleteBtn = document.createElement("input");
        deleteBtn.setAttribute("type","button") ;
        deleteBtn.setAttribute("value", "删除") ;
        deleteBtn.id="deleteButton";
        deleteBtn.onclick=deleteChoosed;
        document.querySelector(".manageBox").appendChild(deleteBtn);

        var input = document.createElement("input");
        input.setAttribute("type","checkbox") ;
        input.onclick=selectAll;
        input.id="selectAll";
        document.querySelector(".manageBox").appendChild(input);

    }
            
    updateCount();
    
}
//一键完成
function completeAll(){
    for(let i=0;i<todoLeft.length;i++)
    {
        todoCompleted.push(todoLeft[i]);
    }
    todoLeft.splice(0,todoLeft.length);
    updateTodoList(type);
    updateStorate();
}
//恢复按钮
function recoverClick(event)
{
    var obj=event.target.parentNode;
    var value=obj.firstChild.innerHTML;
    var tempLi=document.querySelectorAll(".list-li");
    for(let i=tempLi.length-1;i>=0;i--)
    {
        if(tempLi[i]==obj)
        {
            //todoLeft.splice(i,1);
            deleteElement(i);
            todoLeft.unshift(value);
            break;
        }
    }

    updateTodoList(type);
    updateCount();
    updateStorate();
}
//删除按钮
function deleteClick(event){
    var obj=event.target.parentNode;
    deleteTar(obj);
    // if(event.target.classList.contains("delete-btn")){

    // }
}
//根据删除键删除指定按钮，待修改
function deleteTar(obj)
{
    var tempLi=document.querySelectorAll(".list-li");
    for(let i=tempLi.length-1;i>=0;i--)
    {
        if(tempLi[i]==obj)
        {
            //todoLeft.splice(i,1);
            deleteElement(i);
            break;
        }
    }
    timer=setInterval(deleteAnime,1,obj);
}
//触摸开始事件
function touchStart(event){
    var obj=event.target.parentNode;
    if(obj.tagName=="LI"&&obj.classList.contains("list-li"))
    {
        initX=event.targetTouches[0].pageX;
        initY=event.targetTouches[0].pageY;
        objX=(obj.style.WebkitTransform.replace(/translateX/g,"").replace(/px/g, "").replace(/\(/g, "").replace(/\)/g, "")) * 1;
    }
    if(objX==0)
    {
        //收拢状态
        window.removeEventListener("touchmove",touchMove2);
        window.addEventListener("touchmove",touchMove1, { passive: false });
        window.removeEventListener("touchend",touchEnd1);   
        window.addEventListener("touchend",touchEnd2);   
    }
    else if(objX<0){
        //打开状态
        window.removeEventListener("touchmove",touchMove1);
        window.addEventListener("touchmove",touchMove2, { passive: false });
        window.removeEventListener("touchend",touchEnd2);   
        window.addEventListener("touchend",touchEnd1);   
    }

}
//结束事件 无完成版本
function touchEnd1(event){
    var obj = event.target.parentNode;
    if (obj.tagName=="LI"&&obj.classList.contains("list-li")) {
        objX = (obj.style.WebkitTransform.replace(/translateX/g,"").replace(/px/g, "").replace(/\(/g, "").replace(/\)/g, "")) * 1;
        if (objX > -40) {
            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
            objX = 0;
        } 
        else {
            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
            objX = -80;
        }
    }
}
//结束事件 有完成版本
function touchEnd2(event){
    var obj = event.target.parentNode;
    if (obj.tagName=="LI"&&obj.classList.contains("list-li")) {
        objX = (obj.style.WebkitTransform.replace(/translateX/g,"").replace(/px/g, "").replace(/\(/g, "").replace(/\)/g, "")) * 1;
        if(obj.classList.contains("completed")&&objX>0)
        {
            objX=0;
        }
        if(objX>40)
        {
            addCompleted(obj)
            //todoCompleted.push(obj.firstChild.innerHTML);
            deleteTar(obj);
        }
        else if (objX > -40) {
            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
            objX = 0;
        } 
        else {
            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
            objX = -80;
        }
    }
}
//移动事件 未张开版本
function touchMove1(event){
    var obj = event.target.parentNode;
    if (obj.tagName=="LI"&&obj.classList.contains("list-li")) {
        moveX = event.targetTouches[0].pageX;
        moveY=Math.abs(event.targetTouches[0].pageY-initY);
        X = moveX - initX;
        if(moveY>20)
        {
            X=0;
        }
        else if(!obj.classList.contains("completed")){
            event.preventDefault();
        }
        if(X<-80)
        {
            X=-80;
        }
        if(X>0&&obj.classList.contains("completed"))
        {
            X=0;
        }
        obj.style.WebkitTransform= "translateX(" + X+ "px)";


        // if (X >= 0) {
        //     obj.style.WebkitTransform = "translateX(" + 0 + "px)";
        // } else if (X < 0) {
        //     var l = Math.abs(X);
        //     obj.style.WebkitTransform = "translateX(" + -l + "px)";
        //     if (l > 80) {
        //         l = 80;
        //         obj.style.WebkitTransform = "translateX(" + -l + "px)";
        //     }
    }
}
//移动事件 张开版本
function touchMove2(event){
    var obj = event.target.parentNode;      
    if (obj.tagName=="LI"&&obj.classList.contains("list-li")) {        
        event.preventDefault();               
        moveX = event.targetTouches[0].pageX;                       
        X = moveX - initX;  
        moveY=Math.abs(event.targetTouches[0].pageY-initY);
        if(moveY>80)
        {
            return;
        }                       
        if (X >= 0) {           
            var r = -80 + Math.abs(X);     
            obj.style.WebkitTransform = "translateX(" + r + "px)";
            if (r > 0) {
                r = 0;
                obj.style.WebkitTransform = "translateX(" + r + "px)";
            }     
        } else { //向左滑动    
            obj.style.WebkitTransform = "translateX(" + -80 + "px)";       
        }
    }
}
//删除动画
function deleteAnime(target)
{
    var tempX=target.style.WebkitTransform.replace(/translateX/g,"").replace(/px/g, "").replace(/\(/g, "").replace(/\)/g, "") * 1;
    tempX+=10;
    target.style.WebkitTransform= "translateX(" + tempX + "px)";
    if(tempX>=400)
    {
        clearInterval(timer);
        //target.remove();
        updateTodoList(type);
        updateCount();
        updateStorate();
    }
}
//添加完成事项
function addCompleted(target)
{
    todoCompleted.push(target.firstChild.innerHTML);   
    //updateTodoList(type);
}
//删除选定项，待修改
function deleteChoosed()
{
    var checkBoxes=document.querySelectorAll(".checkbox");
    var tempLi=document.querySelectorAll(".list-li");
    for(let i=checkBoxes.length-1;i>=0;i--)
    {
        if(checkBoxes[i].checked)
        {
            //tempLi[i].remove();
            //todoLeft.splice(i,1);
            deleteElement(i);
        }
    }
    document.getElementById("selectAll").checked=false;
    updateCount();
    updateTodoList(type);
    updateStorate();
}
//更新残留事项
function updateCount()
{
    var manageBtn=document.getElementById("manageButton");
    var todoCount=document.querySelector(".todo-count");
    if(manageBtn.value=="管理"){
        var count=todoLeft.length;
        if(count==0)
        {
            todoCount.innerHTML="No item left";
        }
        else
        {
            todoCount.innerHTML=count+" item left";
        }
    }
    else{
        var checkBoxes=document.querySelectorAll(".checkbox");
        var count=0;
        for(let i=0;i<checkBoxes.length;i++)
        {
            if(checkBoxes[i].checked)
            {
                count++;
            }
        }
        if(count==0)
        {
            todoCount.innerHTML="No item choosed";
        }
        else
        {
            todoCount.innerHTML=count+" item choosed";
        }
    }
   
}
//全选
function selectAll()
{
    var selectAll=document.getElementById("selectAll");
    if(selectAll.checked)
    {
        var checkbox=document.querySelectorAll(".checkbox");
        for(let i=0;i<checkbox.length;i++)
        {
            checkbox[i].checked=true;
        }
        updateCount();
    }
    else
    {
        var checkbox=document.querySelectorAll(".checkbox");
        for(let i=0;i<checkbox.length;i++)
        {
            checkbox[i].checked=false;
        }
        updateCount();
    }

    
}
//选定查看模式
function selectLabel(event)
{
    var selectLabels=document.querySelectorAll(".showType");
    for(let i=0;i<selectLabels.length;i++)
    {
        var tempSelect=selectLabels[i];
        if(tempSelect.classList.contains("selected"))
        {
            tempSelect.classList.remove("selected");
        }
    }
    event.target.classList.add("selected");
    type=event.target.innerHTML;
    updateTodoList(type);
    updateStorate();
}
//删除所有事项
function removeAll()
{
    var tempLi=document.querySelectorAll(".list-li");
    var length=tempLi.length;
    for(let i=0;i<length;i++)
    {
        tempLi[i].remove();
    }
    updateCount();
}
//更新todolist
function updateTodoList(type)
{
    switch(type){
        case "all":
            removeAll();
            for(let i=todoLeft.length-1;i>=0;i--)
            {
                addTodoItem(todoLeft[i]);
            }
            for(let i=0;i<todoCompleted.length;i++)
            {
                addCompletedItem(todoCompleted[i]);
            }
            break;
        case "left":
            removeAll();
            for(let i=todoLeft.length-1;i>=0;i--)
            {
                addTodoItem(todoLeft[i]);
            }
            break;
        case "complete":
            removeAll();
            for(let i=0;i<todoCompleted.length;i++)
            {
                addCompletedItem(todoCompleted[i]);
            }
            break;
    }
}
//根据状态删除下标对应元素
function deleteElement(i)
{
    switch(type){
        case "all":
        {
            if(i>=todoLeft.length+todoCompleted.length||i<0)
            {
                return;
            }
            else if(i<todoLeft.length)
            {
                todoLeft.splice(i,1);
                return;
            }
            else
            {
                todoCompleted.splice(i-todoLeft.length,1);
                return;
            }
            break;
        }

        case "left":
        {
            if(i>=todoLeft.length||i<0)
            {
                return;
            }
            else
            {
                todoLeft.splice(i,1);
                return;
            }
            break;
        }

        case "complete":
        {
            if(i>=todoCompleted.length||i<0)
            {
                return;
            }
            else
            {
                todoCompleted.splice(i,1);
                return;
            }
            break;
        }

    }
}
//获取下标对应元素
function getElement(i)
{
    switch(type){
        case "all":
        {
            if(i>=todoLeft.length+todoCompleted.length||i<0)
            {
                return null;
            }
            else if(i<todoLeft.length)
            {
                return todoLeft[i];
            }
            else
            {
                return todoCompleted.splice[i-todoLeft.length];
            }
            break;
        }

        case "left":
        {
            if(i>=todoLeft.length||i<0)
            {
                return null;
            }
            else
            {
                return todoLeft[i];
            }
            break;
        }

        case "complete":
        {
            if(i>=todoCompleted.length||i<0)
            {
                return null;
            }
            else
            {
                return todoCompleted[i];
            }
            break;
        }

    }
}
//获取本地数据
function getElements()
{
    var left=storage.getItem("left");
    var complete=storage.getItem("complete");
    if(left!=null&&left!="")
    {
        todoLeft=JSON.parse(left);
    }
    if(complete!=null&&left!="")
    {
        todoCompleted=JSON.parse(complete);
    }
}
//更新本地数据
function updateStorate()
{
    //storage.clear();
    var tempLeft=JSON.stringify(todoLeft);
    var tempComplete=JSON.stringify(todoCompleted);
    storage.setItem("left",tempLeft);
    storage.setItem("complete",tempComplete);
}
//添加更新按钮
// function updateLi()
// {
//     event.preventDefault();
//     var obj=this.parentNode;
//     var tempLi=document.querySelectorAll(".list-li");
//     this.contentEditable="true";
//     this.classList.add("editing");
//     for(let i=0;i<tempLi.length;i++)
//     {
//         if(tempLi[i]==obj)
//         {
//             this.classList.add(i);
//             break;
//         }
//     }
//     this.focus();
// }
function updateTouchStart(event) {
    timer = setTimeout(function () {
        event.preventDefault();
        LongPress(event.target);
    }, 300);
}
function updateTouchMove(event) {
    clearTimeout(timer);
    timer = 0;
}
function updateTouchEnd(event) {
    clearTimeout(timer);
    //if (timer != 0) {
    //    alert('这是点击，不是长按');
    //}
    return false;
}
function LongPress(target)
{
    //event.preventDefault();
    var obj=target.parentNode;
    var tempLi=document.querySelectorAll(".list-li");
    target.contentEditable="true";
    target.classList.add("editing");
    for(let i=0;i<tempLi.length;i++)
    {
        if(tempLi[i]==obj)
        {
            target.classList.add(i);
            break;
        }
    }
    this.focus();
}
//更新完成
function finishUpdate()
{
    var value=this.innerHTML;
    var tempLi=document.querySelector(".editing");
    var iter=tempLi.classList[2];
    if(value!="")
    {
        todoLeft[iter]=value;
    }
    else
    {
        this.innerHTML=todoLeft[iter];
    }
    updateStorate();
    this.contentEditable="false";
    this.classList.remove("editing");
    this.classList.remove(iter);
}