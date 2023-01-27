"use strict"
window.onload = function()
{
  let bombNum = 0;
  let fieldWidth = 0, fieldHeight = 0;
  let elementfield;
  let numberField;
  document.querySelector("button").addEventListener("click", input);
  document.onkeyup = document.onkeydown = keyboardInput;
  let x = 0, y = 0;
  let currentCell = null;
  let gameStarted = false;
  let gameEnded = false;
  let ready = false;
  let firstPress = false;
  let currentX = 0, currentY = 0;


  function generateField(x,y)
  {
    let bombCounter = 0;
    while (bombCounter < bombNum )
      bombCounter = gen(bombCounter,x, y);
    placeNumbers();

  }

  function gen(bombCounter, x, y)
  {
    /*let i = 0;
    while (i < bombNum)
    {
      let xbomb = Math.floor(Math.random() * fieldHeight),
      ybomb = Math.floor(Math.random() * fieldWidth);
      console.log(fieldWidth , fieldHeight);
      if (xbomb != x && ybomb != y)
      {
        numberField[xbomb, ybomb] = -1;
        i++;
      }
    }*/
    for (let i = 0; i < fieldHeight; i ++)
    {
      for (let j = 0; j < fieldWidth; j++)
          if (numberField[i][j] != -1)
            if (Math.random() < 0.02 && bombCounter < bombNum && i != y && j != x)
            {
              numberField[i][j] = -1;
              bombCounter++;
            }
    }
    return bombCounter;
  }

  function showField(arg)
  {
    if (arg == 0)
      for (let i = 0; i < fieldHeight; i++)
      {
        for (let j = 0; j < fieldWidth; j++)
        {
          if (numberField[i][j] >= 0)
          {
            elementfield[i][j].className = "td-opened";
            if (numberField[i][j] > 0)
              elementfield[i][j].textContent = numberField[i][j];
          }
          if (numberField[i][j] == -1)
            elementfield[i][j].className = "td-mine";
        }
      }
      if (arg == 1)
      {
        for (let i = 0; i < fieldHeight; i++)
        {
          for (let j = 0; j < fieldWidth; j++)
          {
            if (numberField[i][j] >= 0)
            {
              elementfield[i][j].className = "td-opened";
              if (numberField[i][j] > 0)
                elementfield[i][j].textContent = numberField[i][j];
            }
            if (numberField[i][j] == -1)
              elementfield[i][j].className = "td-mine-win";
          }
      }
    }
  }


  function placeNumbers()
  {
    for (let i = 0; i < fieldHeight; i++)
    {
        for (let j = 0; j < fieldWidth; j++)
        {
          if (numberField[i][j] == -1)
          {
            if (i - 1 >= 0 && j - 1 >= 0 && numberField[i-1][j-1] != -1)
              numberField[i-1][j-1]++;
            if (j - 1 >= 0 && numberField[i][j-1] != -1)
              numberField[i][j-1]++;
            if (i + 1 < fieldHeight && j - 1 >= 0 && numberField[i+1][j-1] != -1)
              numberField[i+1][j-1]++;
            if (i - 1 >= 0 && numberField[i-1][j] != -1)
              numberField[i - 1][j]++;
            if (i + 1 < fieldHeight  && numberField[i+1][j] != -1)
              numberField[i + 1][j]++;
            if (i - 1 >= 0 && j + 1 < fieldWidth && numberField[i-1][j+ 1] != -1)
              numberField[i - 1][j+1]++;
            if (j + 1 < fieldWidth && numberField[i][j+1] != -1)
              numberField[i][j+1]++;
            if (i + 1 < fieldHeight && j + 1 < fieldWidth && numberField[i+1][j+1] != -1)
              numberField[i+1][j+1]++;
          }
        }
    }
  }

  function openCell(x, y)
  {
    console.log('x' +  x, 'y' + y );
    if (numberField[y][x] == -1)
    {
      elementfield[y][x].className = "td-mine";
      gameEnded = true;
      gameStarted = false;
      ready = false;
      showField(0);
      alert("Game over");
      return;
    }
    if (!gameStarted)
    {
      generateField(x,y);
      gameStarted = true;
    }
    if (numberField[y][x] > 0)
      elementfield[y][x].textContent = numberField[y][x];
    if (numberField[y][x] > -1)
    {
      elementfield[y][x].className = "td-opened";
      checkWin();
      if (numberField[y][x] > 0)
      {
        return;
      }
    }
    if (x - 1 >= 0 && numberField[y][x-1] > -1 && elementfield[y][x-1].className!="td-opened")
      openCell(x-1,y);
    if (y - 1 >= 0 && numberField[y-1][x] > -1 && elementfield[y-1][x].className!="td-opened")
      openCell(x,y-1);
    if (x + 1 < fieldWidth  && numberField[y][x+1] > -1 && elementfield[y][x+1].className!="td-opened")
      openCell(x+1,y);
    if (y + 1 < fieldHeight && numberField[y+1][x] > -1 && elementfield[y+1][x].className!="td-opened")
      openCell(x,y+1);
  }

  function checkWin()
  {
    if (countUnopened() == fieldWidth * fieldHeight - bombNum)
    {
      gameEnded = true;
      gameStarted = false;
      ready = false;
      showField(1);
      alert("Game win");
    }
  }

  function countUnopened()
  {
    let counter = 0;
    for (let i = 0; i < document.querySelectorAll("td").length; i++)
    {
      if (document.querySelectorAll("td")[i].className == "td-opened")
        counter++;
    }
    return counter;
  }

  function setFlag(event)
  {
    if (event !=  null)
      event.preventDefault();

    if (!gameEnded)
    {
      let classes = elementfield[currentX][currentY].classList;
      if (!arrayIncludes(classes, "td-opened"))
      {
        if (!arrayIncludes(classes,"td-flag"))
        {
          elementfield[currentX][currentY].classList.add("td-flag");
        }
        else
        {
           elementfield[currentX][currentY].classList.remove("td-flag");
        }
        checkWin();
      }
    }
  }

  function arrayIncludes(arr,elem)
  {
    for (let i = 0; i < arr.length; i++)
    {
      console.log(arr[i]);
      if (arr[i] == elem)
        return true;
    }
    return false;
  }

  function input()
  {
    if (!gameStarted || gameEnded)
    {
      if (!ready)
      {
        if (gameEnded)
        {
          let a = 0;
          //alert(document.querySelectorAll("td").length);
          while ( document.querySelector("td") != null)
            document.querySelector("td").remove();
          while(document.querySelector("tbody") != null)
            document.querySelector("tbody").remove();
          fieldWidth = 0;
          fieldHeight = 0;
          bombNum = 0;
        }
        gameEnded = false;
        fieldWidth = document.querySelector("input[name=\"width\"]").value;
        fieldHeight = document.querySelector("input[name=\"height\"]").value;
        bombNum = document.querySelector("input[name=\"bombs\"]").value;
        let table = document.querySelector("table");
        let k = 0;
        currentX = 0;
        currentY = 0;
        numberField = new Array(fieldHeight);
        for (let i = 0; i < fieldHeight; i ++)
        {
          numberField[i] = new Array(fieldWidth);
          for (let j = 0; j < fieldWidth; j++)
            numberField[i][j] = 0;
        }
        for (let i = 0; i < fieldHeight; i++)
        {
          table.insertAdjacentHTML("beforeend","<tr></tr>")
          for (let j = 0; j < fieldWidth; j++)
          {
            table.querySelectorAll("tr")[i].insertAdjacentHTML("beforeend","<td></td>");
          }
        }
        elementfield = new Array(fieldHeight);
        for (let i = 0; i < fieldHeight; i++)
        {
          elementfield[i] = new Array(fieldWidth);
          for (let j = 0; j < fieldWidth; j++)
          {
            elementfield[i][j] = document.querySelectorAll("tr td")[k];
            elementfield[i][j].addEventListener("click", elemClick)
            elementfield[i][j].addEventListener("contextmenu", setFlag);
            elementfield[i][j].addEventListener("mouseover", hoverCell);
            elementfield[i][j].addEventListener("mouseout", unHoverCell);
            elementfield[i][j].x = i;
            elementfield[i][j].y = j;
            k++;
          }
        }
        gameStarted = false;
        ready = true;
        currentX = 0; currentY = 0;
        firstPress = false;
      }

    }
  }

  function hoverCell(event)
  {
    if (event != null)
    {
      currentCell = this;
      currentX = this.x; currentY = this.y;
    }
    console.log(currentX, currentY);
    if (elementfield != undefined && elementfield[currentX][currentY])
      elementfield[currentX][currentY].classList.add("td-hovered");
  }

  function unHoverCell(event)
  {
    if (event != null)
    {
      currentCell = this;
      currentX = this.x; currentY = this.y;
    }
    if (elementfield != undefined)
      for (let i = 0; i < fieldHeight; i++)
      {
        for (let j = 0; j < fieldWidth; j++)
          elementfield[i][j].classList.remove("td-hovered");
      }
  }

  function keyboardInput(event)
  {

    if (event.type == "keydown" && event.ctrlKey && (event.code == "Space" || event.code =="Enter"))
    {
      event.preventDefault();
      setFlag();
      return;
    }
    if (event.type == "keydown")
    {
      if (event.code == "ArrowDown")
      {
        unHoverCell();
        if (currentX < fieldHeight - 1)
          currentX++;
        hoverCell();
        event.preventDefault();
      }
      if (event.code == "ArrowUp")
      {
        unHoverCell();
        if (currentX > 0)
          currentX--;
        event.preventDefault();
      }
      if (event.code == "ArrowLeft")
      {
        unHoverCell();
        if (currentY > 0)
          currentY --;
        event.preventDefault();
      }
      if (event.code == "ArrowRight")
      {
        unHoverCell();
        if (currentY  < fieldWidth - 1)
          currentY ++;
        event.preventDefault();
      }
      if (event.code == "Space" || event.code == "Enter")
      {
        event.preventDefault();
        openCell(currentY, currentX);
      }
    }
    hoverCell();
    if (gameEnded)
    {
      input();
    }
  }

  function elemClick()
  {
    if (!gameEnded)
    {
      for (let i = 0; i < document.querySelectorAll("td").length; i++)
      {
        if (this === document.querySelectorAll("td")[i])
        {
          //console.log(Math.round((i/12) - 0.5), i%12);
          firstPress = true;
          openCell(currentY,currentX);
        }
      }
    }
    else
      input();
  }
}
