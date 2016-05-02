'use strict';

export class MainPageController {
  constructor(
    private $timeout: angular.ITimeoutService
  ) {
    console.log('test');
    
    
  }

  async $onInit() {
    console.log('init');
    
    let value = await this.getValues();
    console.log('value:', value);
  }
  
  getValues() : Promise<string> {
    return new Promise(resolve=>{
      resolve('test');
    });
  }
}

/**
 * MainPage Component
 */
export const MainPage: angular.IComponentOptions = {
  template: `
    <p>
      My Page
    </p>
  `,
  controller: MainPageController
};


