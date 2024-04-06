import { Control } from '../core/control';

const eventMock = {
  KeyQ: new KeyboardEvent('keydown', { code: 'KeyQ', key: 'Q' }),
  KeyW: new KeyboardEvent('keydown', { code: 'KeyW', key: 'W' }),
  KeyE: new KeyboardEvent('keydown', { code: 'KeyE', key: 'E' }),
  KeyA: new KeyboardEvent('keydown', { code: 'KeyA', key: 'A' }),
  KeyS: new KeyboardEvent('keydown', { code: 'KeyS', key: 'S' }),
  KeyD: new KeyboardEvent('keydown', { code: 'KeyD', key: 'D' }),
  Space: new KeyboardEvent('keydown', { code: 'Space', key: ' ' }),
};

describe('Control', () => {
  let control: Control;

  beforeEach(() => {
    control = new Control();
  });

  it('should work', async () => {
    jest.spyOn(control, 'onKeyDown');
    let callback = jest.fn();

    control.onKeyDown = callback;

    window.dispatchEvent(eventMock.KeyA);

    expect(callback).toHaveBeenCalledWith(eventMock.KeyA);
  });
});
