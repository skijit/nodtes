(function($){
  $(function(){

    $(document).ready(function(){
        $('.button-collapse').sideNav({tempSendToTop: true});
        
        populateSideNav();
        
        initSectionToggle();
        
        $('.scrollspy').scrollSpy();
        
    });
    
    function populateSideNav() {
        $('a.tree-dir').click(function(event) {
            var $ul = $(this).next("ul.tree-dir-contents");
            $ul.toggleClass("tree-close");
            if ($ul.hasClass("tree-close")) {
                $ul.hide(200);
                $("i.material-icons", this).html("keyboard_arrow_right");
            } else {
                $ul.show(200);
                $("i.material-icons", this).html("keyboard_arrow_down");
            }
            event.preventDefault();
        });
        $("a.tree-dir").click();  //collapse all
        $("li.active-path > a.tree-dir").click();  //expand the active-path
    }
    
    
    function enumerateChildren($parent, children) {
        var childSelector = "div.section[data-parent='" + $parent.attr('id') + "']";
        $(childSelector).each(function(ind, elem) {
            children.push(elem);
            enumerateChildren($(elem), children)
        });
        return children;
    }
    
    function initSectionToggle() {
        $("i.section-toggle").click(function() {
            var $sectionDiv = $(this).parents("div.section");
            sectionToggle($sectionDiv, 'toggle');
        });
    }
    
    function sectionToggle($sectionDiv, changeType) {
        var $icon = $("i.section-toggle", $sectionDiv)
        var $header = $icon.parent();
            
        var childElements = [];
        childElements = enumerateChildren($sectionDiv, childElements);
        $sectionDiv.children().not($header).each(function (ind, elem) { childElements.push(elem); });
        
        if (changeType === 'toggle') {
            $sectionDiv.hasClass("tree-close") ? openSectionToggle($sectionDiv, childElements, $icon) : closeSectionToggle($sectionDiv, childElements, $icon);
        } else if (changeType === 'open') {
            openSectionToggle($sectionDiv, childElements, $icon);
        } else { //changeType === 'close'
            closeSectionToggle($sectionDiv, childElements, $icon);
        }
        
        refreshScrollSpy();
        
        reassignDeactivatedLinkClickHandlers();
    }
    
    function closeSectionToggle($sectionDiv, associatedElements, $icon) {
        $sections = $(associatedElements).filter("div.section").add($sectionDiv[0]); 
        $sections.removeClass("scrollspy").addClass("tree-close");
        
        $sections.each(function(ind, elem) {
            var curId = $(elem).attr("id");
            var linkSelector = "a[href='#" + curId + "']";
            $(linkSelector, "ul.table-of-contents").addClass('deactivate');
        });
        
        $(associatedElements).hide(200);
        $icon.html("keyboard_arrow_right");
        
    }
    
    function openSectionToggle($sectionDiv, associatedElements, $icon) {
        $sections = $(associatedElements).filter("div.section").add($sectionDiv[0]);
        $sections.addClass("scrollspy").removeClass("tree-close");
        
        $sections.each(function(ind, elem) {
            var curId = $(elem).attr("id");
            var linkSelector = "a[href='#" + curId + "']";
            $(linkSelector, "ul.table-of-contents").removeClass('deactivate');
        });
        
        $(associatedElements).show(200);
        $icon.html("keyboard_arrow_down");
        
    }
    
    function reassignDeactivatedLinkClickHandlers() {
        $("a", "ul.table-of-contents").off("click.tocViewer");
        $("a.deactivate", "ul.table-of-contents").on("click.tocViewer", deactivatedLinkClickHandler);
    }
        
    function deactivatedLinkClickHandler(eventData) {
        var elemSelector = $(eventData.target).attr("href");
        openParentSection($(elemSelector), true);
    }
    
    function refreshScrollSpy() {
        $('.scrollspy').scrollSpy(); 
        //$(".table-of-contents a.active").removeClass('active');
    }
    
    function openParentSection($curSection) {
        sectionToggle($curSection, "open");
        if ($curSection.attr("data-parent"))
            sectionToggle($("#"+$curSection.attr("data-parent")), "open");
    }
    
  }); // end of document ready
})(jQuery); // end of jQuery name space

