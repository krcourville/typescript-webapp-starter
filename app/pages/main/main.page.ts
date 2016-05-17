export interface IMainPageController {

}

class MainPageController implements IMainPageController {

}

export const MainPage: ng.IComponentOptions = {
  templateUrl: 'main.page.html',
  controller: MainPageController
};

