import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Page404Component } from './page404.component';

//bloque de pruebas unitarias
describe('Page404Component', () => {
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;

  //beforeEach configura el entorno de pruebas
  //waitForAsync ejecuta codigo antes del inicio
  beforeEach(waitForAsync(() => {
    //configura el modulo de prueba
    TestBed.configureTestingModule({
    imports: [Page404Component]
}).compileComponents();
  }));

  //crea la instancia del componente y lo inicializa
  beforeEach(() => {
    fixture = TestBed.createComponent(Page404Component); //crea la instancia del componente
    component = fixture.componentInstance; //obtiene el componente desde el fixture
    fixture.detectChanges(); //detecta los cambios
  });

  //verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); //el componente debe existir
  });
});
