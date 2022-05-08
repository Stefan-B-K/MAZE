const addSwipeGesture = (gestureZone, tapRange = 50, callback) => {
  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  gestureZone.addEventListener('touchstart', function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  }, false);

  gestureZone.addEventListener('touchend', function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
  }, false);

  function handleGesture() {
    if (Math.abs(touchendY - touchstartY) <= tapRange &&
      Math.abs(touchendX - touchstartX) <= tapRange) return
    if (touchstartX - touchendX > tapRange) callback('left')
    if (touchendX - touchstartX > tapRange) callback('right')
    if (touchstartY - touchendY > tapRange) callback('up')
    if (touchendY - touchstartY > tapRange) callback('down')
  }
}

const addMouseSupport = () => {
  World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
    constraint: { stiffness: 0.1, render: { visible: false } }
  }))
}