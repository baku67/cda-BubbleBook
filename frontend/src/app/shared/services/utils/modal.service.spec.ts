// import { TestBed } from '@angular/core/testing';
// import { ModalService } from './modal.service';
// import { ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
// import { ModalComponent } from '../../ui-components/modal/modal.component';

// describe('ModalService', () => {
//   let service: ModalService;
//   let appRefSpy: jasmine.SpyObj<ApplicationRef>;
//   let componentFactoryResolverSpy: jasmine.SpyObj<ComponentFactoryResolver>;
//   let injectorSpy: jasmine.SpyObj<Injector>;

//   beforeEach(() => {
//     const mockAppRef = jasmine.createSpyObj('ApplicationRef', ['attachView', 'detachView']);
//     const mockComponentFactoryResolver = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
//     const mockInjector = jasmine.createSpyObj('Injector', ['get']);

//     TestBed.configureTestingModule({
//       providers: [
//         ModalService,
//         { provide: ApplicationRef, useValue: mockAppRef },
//         { provide: ComponentFactoryResolver, useValue: mockComponentFactoryResolver },
//         { provide: Injector, useValue: mockInjector },
//       ],
//     });

//     service = TestBed.inject(ModalService);
//     appRefSpy = TestBed.inject(ApplicationRef) as jasmine.SpyObj<ApplicationRef>;
//     componentFactoryResolverSpy = TestBed.inject(ComponentFactoryResolver) as jasmine.SpyObj<ComponentFactoryResolver>;
//     injectorSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should open a modal', () => {
//     const mockComponentRef = jasmine.createSpyObj('ComponentRef', ['destroy'], {
//       hostView: {},
//       instance: {},
//     }) as ComponentRef<ModalComponent>;

//     const mockModalFactory = jasmine.createSpyObj('ComponentFactory', ['create']);
//     mockModalFactory.create.and.returnValue(mockComponentRef);

//     componentFactoryResolverSpy.resolveComponentFactory.and.returnValue(mockModalFactory as any);

//     service.open(ModalComponent);

//     expect(componentFactoryResolverSpy.resolveComponentFactory).toHaveBeenCalledWith(ModalComponent);
//     expect(appRefSpy.attachView).toHaveBeenCalledWith(mockComponentRef.hostView);
//   });

//   it('should close a modal', () => {
//     const closeSpy = spyOn(service['closeSubject'], 'next');
//     const mockComponentRef = jasmine.createSpyObj('ComponentRef', ['destroy'], {
//       hostView: {},
//       instance: {},
//     }) as ComponentRef<ModalComponent>;

//     const mockModalFactory = jasmine.createSpyObj('ComponentFactory', ['create']);
//     mockModalFactory.create.and.returnValue(mockComponentRef);

//     componentFactoryResolverSpy.resolveComponentFactory.and.returnValue(mockModalFactory as any);

//     service.open(ModalComponent);
//     service.close('Test Result');

//     expect(closeSpy).toHaveBeenCalledWith('Test Result');
//     expect(appRefSpy.detachView).toHaveBeenCalledWith(mockComponentRef.hostView);
//     expect(mockComponentRef.destroy).toHaveBeenCalled();
//   });

//   it('should subscribe to close$', () => {
//     const callback = jasmine.createSpy('callback');
//     service.subscribeToClose(callback);

//     service['closeSubject'].next('Result');

//     expect(callback).toHaveBeenCalledWith('Result');
//   });
// });
