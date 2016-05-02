'use strict';

export class MainPageController {
  constructor() {
    console.log('test');
  }

  $onInit() {
    console.log('init');
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


