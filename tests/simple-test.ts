import { expect } from 'chai';

//For more information (Parametrized tests etc) : https://mochajs.org/#getting-started


describe('Test sum 2 numbers', () => {

  it('should be 4', () => {

    const result = 2 + 2

    expect(result).to.equal(4);
  });
});

//It is like a test group (for example a functionality)
describe('Test sum 3 numbers', () => {

    //Test case
    it('should be 6', () => {
  
      const result = 2 + 2 + 2
  
      expect(result).to.equal(6);
    });

    //Test case
    it('should be 9', () => {
  
        const result = 2 + 3 + 4
    
        expect(result).to.equal(9);
      });
  });