var imageX = 1;
var imageY = 1;
function RenderImage(imageUrl){

    var name = imageUrl;
      if(name)
      {
        var imageSrc = name;
  
        var img = document.createElement('img');
        var loaded = false, wait;

	 	img.addEventListener('load', function () { loaded = true; }, true);

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
          
       }	
  };
  function loadTextractPopup()
  {
    if(!textractJson.Blocks)
    {
      $("#popup-text").text("Image not uploaded.\n Please upload a valid image file");
      return;
    }
    var type = $("input[name='type']:checked").val();
    var content = ["<h2>", type[0], type.slice(1).toLowerCase(),"s", " extracted from the uploaded image</h2>"];    
    $.each( textractJson.Blocks, function( i, item ) {
          if ( item.BlockType.Value === type) {
            content.push(
              "<span>",
              item.Text,
              "</span>",
              "&nbsp;&nbsp;"
            );           
            }
        });
    $("#popup-text").html(content.join(""));      
  };
  function loadRekognitionPopup()
  {
    if(!textractJson.Blocks)
    {
      $("#popup-text").text("Image not uploaded.\n Please upload a valid image file");
      return;
    }
    var type = $("input[name='type']:checked").val();
    var content = ["<h2>", type[0], type.slice(1).toLowerCase(),"s", " extracted from the uploaded image</h2>"];    
    $.each( textractJson.Blocks, function( i, item ) {          
          if ( item.Type.Value === type) {
            content.push(
              "<span>",
              item.DetectedText,
              "</span>",
              "&nbsp;&nbsp;"
            );           
            }
        });
    $("#popup-text").html(content.join(""));      
  };
  function toggle_visibility(id){              
      var e = document.getElementById(id);
      if(e.style.display == 'block')
          e.style.display = 'none';
      else 
          e.style.display = 'block';
  };
  Filevalidation = () => { 
    const fileLocal = document.getElementById('fileUpload'); 
    // Check if any file is selected. 
    if (fileLocal.files.length == 1) {
      const fsize = fileLocal.files.item(0).size; 
      const file = Math.round((fsize / 1024)); 
      // The size of the file. 
      if (file >= 2048) { 
          alert("File too Big, please select a file less than 2MB");
          return false;
      }
    }
    const fileUrl = document.getElementById('file');
    if(fileLocal.files.length == 1 || fileUrl.value.length > 0)
    { 
      var upload = document.getElementById('upload');
      if(upload)
      {
        upload.removeAttribute("disabled");
      }
    }   
}; 