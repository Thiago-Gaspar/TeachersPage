module.exports = 
    {
        graduation: function () {
   
           const schooling = document.getElementsByTagName('select')
           const value = schooling.getElementsById('1')

           if (schooling.value == 1) {
               return res.send("Ensino Médio")
           }
   
           return ("/teachers")
       
       }
   }
