
const db = globalThis.db
                                                                                                                                                                                                   
 // Add directional light                                                                                                                                                                          
 db.addEntity({                                                                                                                                                                                    
     uuid: '/light/directional',                                                                                                                                                                   
     type: 'directionalLight',
         position: { x: 1, y: 1, z: 1 },                                                                                                                                                                
     volume: {                                                                                                                                                                                
         geometry:'directionalLight',
         lightType: 'directional',                                                                                                                                                                     
         color: 0xffffff,                                                                                                                                                                              
         intensity: 1,                                                                                                                                                                                 
     }
 });                                                                                                                                                                                               
                                                                                                                                                                                                   
 // Add ambient light                                                                                                                                                                              
 db.addEntity({                                                                                                                                                                                    
     uuid: '/light/ambient',                                                                                                                                                                       
     type: 'ambientLight',                                                                                                                                                                                
         position: { x: 1, y: 1, z: 1 },                                                                                                                                                                
     volume: {
         geometry:'ambientLight',
         lightType: 'ambient',                                                                                                                                                                         
         color: 0x404040,                                                                                                                                                                              
         intensity: 1,                                                                                                                                                                                  
         position: { x: 0, y: 0, z: 0 }                                                                                                                                                                
     }
 });               