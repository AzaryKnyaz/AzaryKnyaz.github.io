class GradientAnimation {
  constructor() {
    this.cnv        = document.querySelector(`canvas`);
    //без этого в целом не будет рисовать круги
	this.ctx        = this.cnv.getContext(`2d`);

    this.circlesNum = 20; //количество кружков которые можно создать
    this.minRadius  = 400;
    this.maxRadius  = 800;
	//сбавляем скорость кружков
    this.speed      = .005;
    
	// это адаптация холста, будет выполнять че в фигурных скобках
    (window.onresize = () => {
      this.setCanvasSize();
      this.createCircles();
    })();
	//запуск анимации
    this.drawAnimation();

  }
  setCanvasSize() {
    this.w = this.cnv.width  = innerWidth ;
    this.h = this.cnv.height = innerHeight;
  }
  createCircles() {
	//чтоб совсем крыша не поехала надо запихать все в массив 
    this.circles = [];
    for (let i = 0 ; i < this.circlesNum ; ++i) {
      this.circles.push(new Circle(this.w, this.h, this.minRadius, this.maxRadius));
    }
  }
  //вот тут то самое рисование кругов вызовом метода 
  drawCircles() {
    this.circles.forEach(circle => circle.draw(this.ctx, this.speed));
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.w, this.h); 
  }
  //вызываем из метода анимации, она рекурсивна
  drawAnimation() {
	//чистим холст чтоб после кругов ниче не оставалось
    this.clearCanvas();
    this.drawCircles();
	//вот эта штука делает рекурсию да
    window.requestAnimationFrame(() => this.drawAnimation());
  }
}

//частицы в случайных местах
class Circle {
  constructor(w, h, minR, maxR) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
	//и он крутится вертится
    this.angle  = Math.random() * Math.PI * 2;
	//случайный радиус окружностей
    this.radius = Math.random() * (maxR - minR) + minR;
	//тут рандомная генерация цветов, надо менять
    this.firstColor  = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
    this.secondColor = `hsla(${Math.random() * 360}, 100%, 50%, 0)`;
  }
  //рисовать кружки
  draw(ctx, speed) {
    this.angle += speed;
    const x = this.x + Math.cos(this.angle) * 200;
    const y = this.y + Math.sin(this.angle) * 200;
	//тут эти вот градиенты
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
          gradient.addColorStop(0, this.firstColor);
          gradient.addColorStop(1, this.secondColor);

    ctx.globalCompositeOperation = `overlay`;
    //то самое заполнение цветом
	ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill(); 
  }
}

//скрипт только после полной загрузки страницы
window.onload = () => {
  new GradientAnimation();
}
