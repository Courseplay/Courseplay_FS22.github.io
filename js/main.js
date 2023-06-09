(function (window, document) {
    
    let supportedLanguages = [  "en", "de", "jp", "pl", "cz", "fr", 
                                "es", "ru", "it", "pt", "hu", "nl", 
                                "cs", "ct", "br", "tr", "ro", "kr",
                                "ea", "da", "fi", "no", "sv", "fc" ]

    let languageNames = [   "English", "German", "Japanese", "Polski", "Czech",	"French",
                            "Spanish", "Russian", "Italiano", "Portuguese", "Hungarian", "Dutch",
                            "Chinese Simplified", "Chinese Traditional", "Brazilian Portuguese", 
                            "Turkish", "Romanian", "Korean", "Spanish LA", 
                            "Danish", "Finnish", "Norwegian", "Swedish", "Canadian French" ]

    let translation_map = new Map();

    window.addEventListener("load", onLoad);

    function onLoad(event){
        // Generate dom text with json generated by python script.
        setupIDs();
        setupLanguages();
        fetch('./translation_data/config.json')
            .then((response) => response.json())
            .then((json) => {
                let raw_categories=json[0];
                applyHeaders(raw_categories)
                applyPages(raw_categories.pages);
                applyLanguage(0);
            });
    }

    function setupIDs(){
        menu_page_template = document.querySelector("#menu_page_template");
        page_template = document.querySelector("#content_page_template");
        paragraph_template = document.querySelector("#content_page_template");
    }

    function applyLanguage(languageIx){
        fetch('./translation_data/'+supportedLanguages[languageIx]+'.json')
            .then((response) => response.json())
            .then((language) => {
                translation_map.forEach((array, index, map) => {
                    if(language[index]){
                        for(let i=0; i<array.length; i++)
                        {
                            array[i].innerHTML = language[index];
                        }
                    }
                })
            });
    }

    function onClickLanguage(ix){
        applyLanguage(ix);
    }

    function setupLanguages(){
        let template = document.querySelector("#menu_language_template");
        for(let i=0;i<supportedLanguages.length;i++)
        {
            let node = template.cloneNode(true);
            node.querySelector("#menu_language_template_name").innerHTML = languageNames[i];
            node.addEventListener("click", () =>{onClickLanguage(i)});
            document.querySelector("#menu_language_list").appendChild(node); 
        }
        removeElement(template);
        // <ul class="pure-menu-children" id="menu_language_list">
        // <li class="pure-menu-item" id="menu_language_template">
        //     <a href="#" class="pure-menu-link" id="menu_language_template_name">Email</a>
    }

    function applyHeaders(categories)
    {
        applyRawText(document, "header_category_title", categories.title);
        setText(document, "header_category_sub_title", "CP_help_subTitle", true);
        applyRawText(document, "menu_category_title", categories.title);
    }

    function applyPages(pages){
        // Menu 
        for(let i=0; i< pages.length;i++){
            const page = pages[i]
            let node = menu_page_template.cloneNode(true);
            applyHref(node, "menu_page_template_title", page.title.raw)
            applyRawText(node, "menu_page_template_title", page.title);
            document.querySelector("#menu_page_list").appendChild(node); 
         //   $('#menu_about').before( node )
        }
        removeElement(menu_page_template);
        // Page content
        for(let i=0; i< pages.length;i++){
            const page = pages[i]
            let node = page_template.cloneNode(true);
            applyRawText(node, "content_page_template_title", page.title);
            applyParentID(node, "content_page_template_title", page.title.raw)
            document.querySelector("#content_list").appendChild(node); 
            applyParagraph(node, page.paragraphs);
            
        }
        removeElement(page_template);

    }

    function applyParagraph(root, paragraphs){
        for(let i=0; i< paragraphs.length;i++){
            const paragraph = paragraphs[i]
            let node = paragraph_template.cloneNode(true);
            applyRawText(node, "content_paragraph_template_title", paragraph.title);
            applyRawText(node, "content_paragraph_template_text", paragraph.text);
            applyImage(node, "content_paragraph_template_image", paragraph.image, paragraph.text.raw);
            root.appendChild(node); 
            
        }
    }

    function applyParentID(root, refId, parentId){
        root.querySelector("#"+refId).parentNode.id = parentId
    }

    function applyHref(root, id, href){
        root.querySelector("#"+id).href = "#"+href;
    }

    function applyImage(root, id, image, alt){
        if(image && image.filename){
            img = root.querySelector("#"+id)
            img.src = "translation_data/"+image.filename;
            img.width = image.size[0];
            img.height = image.size[0];
            img.alt = alt
        }
    }

    function applyRawText(root, id, text){
        if(text!=null){
            setText(root, id, text.raw, true);
        }else{
            setText(root, id, text, true);
        }
    }

    function setText(root, id, text, applyId){
        if(text != null){
            if(text!=""){
                if(text == "CP_help_page_blank"){
                    root.querySelector("#"+id).innerHTML = "";
                }else{
                    root.querySelector("#"+id).innerHTML = "raw: " + text;
                }
            }else{
                root.querySelector("#"+id).innerHTML = text;
            }
            if(applyId){
                let obj;
                if(translation_map.has(text)){
                    obj = translation_map.get(text);
                }else{
                    obj = [];
                }
                obj[obj.length] = root.querySelector("#"+id);
                translation_map.set(text, obj);
            }
        }else{
            root.querySelector("#"+id).innerHTML = "missing:"+id;
        }
    }

    function removeElement(node){
        node.parentNode.removeChild(node);
    }




/*
        <div id="main">
        <div class="header">
            <h1 id="header_category_title"></h1>
            <h2 id="header_category_sub_title"></h2>
        </div>

        <div class="content" id="content_page_template">
            <h2 class="content-subhead" id="content_page_title_template"></h2>
            <div id="content_paragraph_template">
                <h3 class="content-subhead"><u id="content_paragraph_title_template"></u></h3>
                <p id="content_paragraph_text_template"></p>
            </div>
        </div>
        */
    

}(this, this.document));