'use strict';

export class MainPageController {
  constructor(private $http: ng.IHttpService){
    
  }
  
  async $onInit() {
    console.log('init');
    
    let value = await this.getValues();
    console.log('value:', value);
    
    this.getHttp()
      .then(v=> console.log);
  }
  
  getValues() : Promise<string> {
    return new Promise(resolve=>{
      resolve('test');
    });
  }
  
  getHttp(): Promise<any>{
    return fetch('http://ip.jsontest.com')
      .then(res=> res.json());
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


