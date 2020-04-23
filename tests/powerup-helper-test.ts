import { expect } from 'chai';
import {getRandomPowerUp} from '../src/helpers/powerUp-helper'
import { PowerupType } from '../src/Enums/powerup-type';

describe('Test get random powerup', () => {

  it('should be a powerup', () => {

    let powerUp = getRandomPowerUp()
    console.log(powerUp)
    expect(powerUp).not.equal(null)

  });
});