import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

// servicios de alicuotas
import { AliquotService } from '../../services/aliquot/aliquot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-aliquot',
  templateUrl: './aliquot.component.html',
  styleUrls: ['./aliquot.component.scss']
})
export class AliquotComponent implements OnInit {

  // coleccion de usuarios
  collectionUsers = { count: 0, data: [] }

  // coleccion de aliquotas
  collectionAliquots = { count: 0, data: [] }

  // arreglo de estado "Pagado o no"
  estadoCuotaList = [
    'Pagada',
    'Pendiente',
    'No pagada'
  ]

  // formulario para alicuotas
  aliquotFormCreate: FormGroup;

  // variables de estado
  closeResult = '';
  actualizar: boolean; 

   // fecha actual
   fechaActual;
   fechaVencimiento;
   fechaSelect;

  // iniciar servicios
  constructor(private aliquotService: AliquotService,
    public usersService: UsersService,
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    //-----------------------------------------------------------------

      // seteo de la fecha actual
      
      this.fechaActual = Date.now();
      

    
    //-----------------------------------------------------------------

      //cargando todos los usuarios de firebase-firestore
      this.usersService.getUsersServices().subscribe(resp => {
        //console.log('respuesta 1: ', resp)
        // mapeo de los datos de los usuarios en el arreglo collection
        this.collectionUsers.data = resp.map((e: any) => {
          // console.log('respuesta 2: ', e)
          // return que devolvera los datos a collection
          return {
            // seteo de los principales datos que se obtendran de los usuarios
            // y que se reflejaran para el administrador
            id: e.payload.doc.id,
            Nombre: e.payload.doc.data().Name,
            uidUser: e.payload.doc.id
          }
        })
        //console.log(this.collectionUsers.data)

      }, error => {
        // imprimir en caso de que de algun error
        console.error(error);
        }
      );

    //-----------------------------------------------------------------

      //cargando todos los usuarios de firebase-firestore
      this.aliquotService.getAliquotServices().subscribe(resp => {
        //console.log('respuesta 1: ', resp)
        // mapeo de los datos de las alicuotas en el arreglo collectionAliquots
        this.collectionAliquots.data = resp.map((e: any) => {
          // console.log('respuesta 2: ', e)
          // return que devolvera los datos a collection
          return {
            // seteo de los principales datos que se obtendran de los usuarios
            // y que se reflejaran para el administrador
            id: e.payload.doc.id,
            DatosVecino: e.payload.doc.data().DatosVecino.Nombre,
            ValorCuota:e.payload.doc.data().ValorCuota,
            ValorExtra: e.payload.doc.data().ValorExtra,
            Fecha: e.payload.doc.data().Fecha,
            FechaVencimiento: e.payload.doc.data().FechaVencimiento,
            EstadoCuota:e.payload.doc.data().EstadoCuota,
            Descripcion: e.payload.doc.data().Descripcion,
            IdAliquot: e.payload.doc.data().IdAliquot
          }

        })
        console.log(this.collectionAliquots.data)

      }, error => {
        // imprimir en caso de que de algun error
        console.error(error);
        }
      );

    //-----------------------------------------------------------------
      // aleatorio para la alicuota
      const idAliquotRandom = Math.random().toString(36).substring(2);  
      //iniciar formulario para la creacion de alicuotas
      this.aliquotFormCreate = this.formBuilder.group({
        IdAliquot: idAliquotRandom,
        DatosVecino: '',
        ValorCuota:'',
        ValorExtra:'',
        Fecha: Date.toString,
        FechaVencimiento: Date.toString,
        EstadoCuota: '',
        Descripcion:''
      })

    //-----------------------------------------------------------------

  }

  //---------------------------------------------------
  
    createAliquot(){
      this.aliquotService.createAliquotServices(this.aliquotFormCreate.value).then(resp => {
        
        this.ngbModal.dismissAll();
      }).catch(error => {

        console.error(error)
      })
    }
    //------------------------------------------------
    open(content) {
      
      this.ngbModal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        //this.aliquotFormCreate.reset();
      }, (reason) => {
        //this.aliquotFormCreate.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  
  //---------------------------------------------------
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        this.aliquotFormCreate.reset();
        
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        this.aliquotFormCreate.reset();

        return 'by clicking on a backdrop';
      } else {
        this.aliquotFormCreate.reset();
        return `with: ${reason}`;
      }
    }

  //---------------------------------------------------

    cambio(fechaEnviada){
      //console.log(fecha)
      this.fechaSelect = Date.parse(fechaEnviada)
      //console.log(this.FechaFecha)
      var mesDespues= 30*24*60*60*1000
      this.fechaVencimiento = this.fechaSelect + mesDespues ;
    }

  //---------------------------------------------------


}
