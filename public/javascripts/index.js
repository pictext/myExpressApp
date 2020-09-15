var imageX = 1;
var imageY = 1;
function RenderImage(imageUrl){

    var name = imageUrl;
      if(name)
      {
        var imageSrc = name;
  
        var img = document.createElement('img');
        var loaded = false, wait;

        img.addEventListener('load', loadComplete, true);
        function loadComplete(){
          loaded = true;
        }
	 	    wait = setInterval(function () {
     			if(loaded) 
                    { clearInterval(wait);}
                imageX = img.width;
                imageY = img.height
	 			}, 0);
        img.setAttribute('id',"invoiceimg"); 
        img.setAttribute('src', imageSrc);  
        var invoice = document.getElementById("invoice");
        if (invoice.hasChildNodes()) {
            invoice.removeChild(invoice.childNodes[0]);
        }
        invoice.appendChild(img);
        img.removeEventListener('load', loadComplete, true);
        if(textractJson.Blocks[0].BlockType)
        {
          img.addEventListener("load", loadTextractPopup);
        }
        else
        {
          img.addEventListener("load", loadRekognitionPopup);
        }
        document.getElementById('tblContent').style.display = 'block';        
       }	
  };
  function loadTextractPopup()
  {
    if(!textractJson.Blocks)
    {
      alert("Unable to locate english text in the uploaded image.");
      return;
    }
    var type = $("input[name='type']:checked").val(); 
    var content = [];
    const seperator = (type == 'LINE')? '\n' : '\0';   
    $.each( textractJson.Blocks, function( i, item ) {
          if ( item.BlockType.Value === type) {
            content.push(item.Text);           
            }
        });
    //$("#popup-text").html(content.join(seperator));
    $("#textract").val(content.join(seperator));      
  };
  function loadRekognitionPopup()
  {
    if(!textractJson.Blocks)
    {
      alert("Unable to locate english text in the uploaded image.");
      return;
    }
    var type = $("input[name='type']:checked").val();
    var content = [];
    const seperator = (type == 'LINE')? '\n' : '\0'; 
    $.each( textractJson.Blocks, function( i, item ) {          
          if ( item.Type.Value === type) {
            content.push(item.DetectedText);           
            }
        });
      $("#textract").val(content.join(seperator));      
  };
  Filevalidation = () => { 
    const fileLocal = document.getElementById('fileUpload'); 
    // Check if any file is selected. 
    if (fileLocal.files.length == 1) {
      const fsize = fileLocal.files.item(0).size; 
      const file = Math.round((fsize / 1024)); 
      // The size of the file. 
      if (file >= 2048) { 
          alert("File too big, please select a file with less than 2MB size");
          return false;
      }
    }
};
function resetText(){
  $("#textract").val('');
} 
function copyText(){
  $("#textract").select();
  document.execCommand("copy");
}