/*
* mindmap
* https://github.com/Chaptykov/mindmap
*
* Copyright (c) 2013 Chaptykov
* Licensed under the MIT license.
*/ 

(function($) {

    var params;

    var methods = {
        init: function( options ) {
            var self = $(this);

            params = $.extend({

                // Classes
                nodeClass: 'node',
                nodeInputClass: 'node__input',
                nodeTextClass: 'node__text',
                activeClass: 'node_active',
                editableClass: 'node_editable',
                rootClass: 'node_root',
                childrenClass: 'children',
                childrenItemClass: 'children__item',
                leftBranch: 'children_leftbranch',
                rightBranch: 'children_rightbranch',
                stylizedClass: 'stylized_class',

                // Settings
                root: self,
                balance: false

            }, options);

            params.nodes = self.find('.' + params.nodeClass);
            params.nodeInput = self.find('.' + params.nodeInputClass);

            if (self.find(params.activeClass).length) {
                params.activeNode = self.find(params.activeClass);
            }
            else {
                params.activeNode = null;
            }
                     // Keyboard events
            $(document).on('keydown', function(event) {
                if (!params.activeNode) {
                    return;
                }

                var key = event.which || event.keyCode,
                    node = params.activeNode,
                    prevNode,
                    nextNode;

                switch(key) {

                    // Enter
                    case 13:
                        if (!node.hasClass(params.editableClass)) {
                            if (node.hasClass(params.rootClass)) {
                                return;
                            }
                            methods.addNode();
                        }
                        else {
                            methods.blur();
                            methods.setActive(node);

                            return false;
                        }
                        break;

                    // Tab
                    case 9:
                        if (!node.hasClass(params.editableClass)) {
                            event.preventDefault();
                            methods.addChildNode();
                        }
                        else {
                            methods.blur();
                            methods.setActive(node);
                        }
                        break;

                    // Esc
                    case 27:
                        // Возвращаем первоначальное значение, блюрим
                        break;

                    // Delete, backspase
                    case 8:
                    case 46:
                        if (node.hasClass(params.editableClass)) {
                            return true;               
                          
                        }
                        else {
                            if (node.hasClass(params.rootClass)) {
                                return false;
                            }

                            nextNode = node.parent().next().children('.' + params.nodeClass);
                            parentNode = node.parent().parent().prev();

                            event.preventDefault();
                            methods.removeNode();

                            if (nextNode.length) {
                                nextNode.addClass(params.activeClass);
                                params.activeNode = nextNode;
                            } else {
                                parentNode.addClass(params.activeClass);
                                params.activeNode = parentNode;
                            }
                        }
                        break;

                    // Left
                    case 37:
                        if (node.hasClass(params.editableClass)) {
                            return true;
                        }
                        else {
                            if (node.hasClass(params.rootClass)) {
                                methods.selectChildNode($('.' + params.leftBranch));
                            } else {
                                if (node.closest('.' + params.rightBranch).length) {
                                    methods.selectParentNode();
                                }
                                else {
                                    methods.selectChildNode();
                                }
                            }
                        }
                        break;

                    // Up
                    case 38:
                        if (node.hasClass(params.editableClass)) {
                            return true;
                        }
                        else {
                            prevNode = node.parent().prev().children('.' + params.nodeClass);
                            if (prevNode.length) {
                                methods.blur();
                                methods.setActive(prevNode);
                            }
                        }
                        break;

                    // Right
                    case 39:
                        if (node.hasClass(params.editableClass)) {
                            return true;
                        }
                        else {
                            if (node.hasClass(params.rootClass)) {
                                methods.selectChildNode($('.' + params.rightBranch));
                            } else {
                                if (node.closest('.' + params.rightBranch).length) {
                                    methods.selectChildNode();
                                }
                                else {
                                    methods.selectParentNode();
                                }
                            }
                        }
                        break;

                    // Down
                    case 40:
                        if (node.hasClass(params.editableClass)) {
                            return true;
                        }
                        else {
                            nextNode = node.parent().next().children('.' + params.nodeClass);
                            if (nextNode.length) {
                                methods.blur();
                                methods.setActive(nextNode);
                            }
                        }
                        break;

                    //F2   
                    case 113: 
  
                        if ($(node).hasClass('node_editable')) {
                            methods.blur();
                            methods.setActive(node);
                        }
                        else{
                            methods.setEditable(node);
                            console.log('not editable');
                        }
                        
                        break;   

                    //Ctrl
                        case 17:

                            console.log('ctrl');



                        break;


                    default:
                        if ($(node).hasClass('node_editable')){
                            return true; 
                        } else {

                            methods.setEditable(node);
                            console.log('not editable');
                        }
                        
                        break;
                }
            });
            $(document).on('keyup', function() {
                var key = event.which || event.keyCode,
                    node = params.activeNode;
                    //space event when last click was spase
                    switch (key) {

                        //exclude here arrows, enter, tab (do not check it)

                        case 32:
                            if ($(node).hasClass('node_editable')){
                                methods.validClass($(node));
                                console.log($(node).children('div').text());   
                            }
                            break;
                        case 8:
                        case 46:
                           if ($(node).hasClass('node_editable')){
                                methods.validClass($(node));
                            }
                            break;
                        default:
                            if ($(node).hasClass('node_editable')){
                              methods.validClass($(node));   
                            }
                            break;
                    }
            });

            



            
            // Click by node
            self



                /*.on('mouseover', '.' + params.nodeClass, function(e) {
                        var self = $(this);
                    //if mouse over the node it shod create free space (li element) where it will be paced when mouseup 
                        var element = self.parent().parent();

                        //console.log(self.parent().children('ol'));
                        //if body ellement remove sort it can't be a sort or element should add only left top side
                        // remove ID before save to lockal storage (we can clear it after mouse up) 
                        //   $('ol').attr('id', 'sortable');
                        element.attr('id', 'sortable');

                    // also create  sortable for children  ol
                        
                        $( "#sortable" ).sortable({
                            revert: true
                        });
                        $( "ol, li" ).disableSelection();


                })
*/
                
                .on('mousedown', '.' + params.nodeClass, function(e) {
                    var self = $(this);
                    if (e.which === 1) {

                    
                    // Write a function mouseover button
                      
                    }
                   

                    if(e.which === 3) {
                        if (!self.hasClass(params.activeClass)) {
                            methods.blur();
                            methods.setActive(self);
                            //if not active 
                        }
                        //I should bind event context menu +
                        //create list of menu +
                        //call function to delete this Node  

                        // Trigger action when the contexmenu is about to be shown
                        self.bind("contextmenu", function (event) {
                            
                            // Avoid the real one
                            event.preventDefault();
                            
                            // Show contextmenu
                            $(".custom-menu").show().
                            
                            // In the right position (the mouse)
                            css({
                                top: event.pageY + "px",
                                left: event.pageX + "px"
                            });
                        });


                        // If the document is clicked somewhere
                        $(document).bind("mousedown", function (e) {
                            
                            // If the clicked element is not the menu
                            if (!$(e.target).parents(".custom-menu").length) {
                                
                                // Hide it
                                $(".custom-menu").hide();
                            }
                        });
                    }
                
                })
 

                .on('click', '.' + params.nodeClass, function() {

                    var self = $(this),
                        txt;


                    self.zoomTarget({scalemode: "height", duration:500,  targetsize: 0.1,  animationendcallback: null});
                        //what to do
                        //write a function witch should be culc node size and  set 'targetsize' option for big size node

                                        
                    if (!self.hasClass(params.activeClass)) {
                        methods.blur();
                        methods.setActive(self);
                        //if not active 
                       
                    }
                    else {
                        methods.blur();
                        methods.setActive(self);
                        //methods.setEditable(self);
                        //if active check if it is collapsed or not

                        if ($(self).next('ol').hasClass('collapsed')){
                            $(self).next('ol').removeClass('collapsed');
                            $(self).next('ol').css('display', 'inline-block');

                            txt = $(self).children('div').text();
                            txt = txt.substring(0, txt.length - 3);

                            $(self).children('div').text(txt);
                            // console.log('remove collapsed');
                            // remove "..."
                        } else {
                            $(self).next('ol').addClass('collapsed');
                            $(self).next('ol').css('display', 'none');
                            // console.log('add collapsed');

                            if ($(self).next('ol').hasClass('collapsed')){

                            // add '...'
                            txt = $(self).children('div').text();
                            $(self).children('div').text(txt + '...');
                           } 
                        }
                        methods.saveLocal();
                    }
                })
                // Input text
                .on('input paste', '.' + params.nodeInputClass, function() {
                    var node = params.activeNode,
                        nodeText = node.find('.' + params.nodeTextClass),
                        nodeInput = $(this);

                    nodeText.text( nodeInput.val() );

                })
                .on('keydown', '.' + params.nodeInputClass, function(event) {
                    var key = event.which || event.keyCode;
                   // methods.setEditable(self);
                    if (key === 9) {
                        event.preventDefault();
                    }
                })
               .on('dblclick', '.' + params.nodeClass, function() {
                   var self = $(this);
                    
                  //  debugger;
                        //zoom
                      //  $('.mindmap').css('zoom', 100 +'%');
                        self.zoomTarget({scalemode: "height", duration:500,  targetsize: 0.1,  animationendcallback: null});
                        //what to do
                        //write a function witch should be culc node size and  set 'targetsize' option for big size node
                      
                });
        },

        destroy : function( ) {

            $(window).unbind('.mindmap');

        },

        validClass: function (node) {
            var b;
                
                c = node.children('div').text().trim().split(' ')[0];

                switch (c) {
                    case '!':
                        b = 'err';
                        break;
                    case '@':
                        b = 'ni';
                        break;
                    case '#':
                        b = 'nb';
                        break;
                    case '-':
                        b = 'm';
                        break;
                    //add more classes       
                    default:
                        console.log('Method ValidClass: class not found');
                        break;
                }

                if (b) {                    
                    if (node.hasClass(b)) {
                        return true;
                    } else {
                        node.addClass(params.stylizedClass);
                        node.addClass(b);
                    }
                } else if (node.hasClass(params.stylizedClass)){
                    node.removeClass(params.stylizedClass);
                    
                    node.removeClass('err');
                    node.removeClass('ni');
                    node.removeClass('nb');
                    node.removeClass('m');
                    //remove all re-write it!!!!

                }
        },

        selectParentNode: function() {
            var node = params.activeNode,
                parentBranch = node.parent().parent().parent(),
                parentNode;

            parentNode = parentBranch.children('.' + params.nodeClass);
            methods.blur();
            methods.setActive(parentNode);
        },

        selectChildNode: function(branch) {
            var node = params.activeNode,
                childNode;

            if (!branch) {
                branch = node.parent().children('.' + params.childrenClass);
            }

            childNode = branch.children('.' + params.childrenItemClass + ':first-child').children('.' + params.nodeClass);

            if (childNode.length) {
                methods.blur();
                methods.setActive(childNode);
            }
        },

        removeNode: function() {
            var node = params.activeNode,
                nodeBranch = node.parent(),
                parentBranch = nodeBranch.parent(),
                len = parentBranch.children().length - 1;

            if (!len) {
                parentBranch.remove();
            }
            else {
                nodeBranch.remove();
            }

            methods.blur();
            methods.balance();

            methods.saveLocal();
        },
        addNode: function() {
            var nodeBranch = params.activeNode.parent().parent(),
                newNodeItem,
                newNode;

            nodeBranch.append( methods.getTemplate(1) );
            newNodeItem = nodeBranch.children('.' + params.childrenItemClass + ':last');
            newNode = newNodeItem.children('.' + params.nodeClass);

            methods.blur();
            methods.setEditable(newNode);
            methods.balance();

            methods.saveLocal();
        },

        addChildNode: function() {
            var nodeBranch = params.activeNode.parent(),
                nodeChildren = nodeBranch.children('.' + params.childrenClass),
                nodeChildrenItem,
                newNode;

            if (nodeChildren.length) {
                if (params.activeNode.hasClass(params.rootClass) && nodeChildren.length === 2) {
                    nodeChildren = nodeChildren.filter('.' + params.leftBranch);
                }

                nodeChildren.append( methods.getTemplate(1) );
                nodeChildrenItem = nodeChildren.children('.' + params.childrenItemClass + ':last');
                newNode = nodeChildrenItem.children('.' + params.nodeClass);
            }
            else {
                nodeBranch.append( methods.getTemplate(1, 1) );
                nodeChildren = nodeBranch.children('.' + params.childrenClass);
                nodeChildrenItem = nodeChildren.children('.' + params.childrenItemClass + ':last');
                newNode = nodeChildrenItem.children('.' + params.nodeClass);
            }

            methods.blur();
            methods.setEditable(newNode);
            methods.balance();

            methods.saveLocal();
        },

        blur: function() {
            if (!params.activeNode) {
                return;
            }

            var node = params.activeNode,
                nodeText = node.find('.' + params.nodeTextClass),
                nodeInput = node.find('.' + params.nodeInputClass);

            methods.validClass(node);
            if (node.hasClass(params.editableClass)) {
                if(node.parent().children('ol').hasClass('collapsed')) {
                    nodeText.text(nodeInput.val() + '...');

                } else {
                    nodeText.text(nodeInput.val());

                }
                nodeInput.blur();
            }

            node
                .removeClass(params.activeClass)
                .removeClass(params.editableClass)
                .removeClass('zoomTarget');

            params.activeNode = null;
            methods.saveLocal();
        },

        setActive: function(node) {
            node.addClass(params.activeClass);
            params.activeNode = node;
            $('#search').blur();

        },

        setEditable: function(node) {
            var nodeInput = node.find('.' + params.nodeInputClass),
                nodeText = node.find('.' + params.nodeTextClass);

            node
                .addClass(params.activeClass)
                .addClass(params.editableClass)
                .attr('data-value', nodeText.text());

            if(nodeText.text().slice(-3) === '...') nodeText.text(nodeText.text().slice(0,-3));

            if(nodeText.text() === 'Node') {
                nodeInput
                    .val(nodeText.text())
                    .focus()
                    .select();
            } else {
                nodeInput
                    .val(nodeText.text())
                    .focus()
                    .get(0)
                    .setSelectionRange(0,0);
            }
            params.activeNode = node;
        },

        balance: function() {
            if (params.balance) {
                var height = 0,
                    delta,
                    newDelta,
                    rBranch = $('.' + params.rightBranch),
                    lBranch = $('.' + params.leftBranch),
                    rBranchChildren,
                    lBranchChildren,
                    sumHeight = 0,
                    rootBranches = params.root.children('.' + params.childrenClass),
                    freeBranch;

                // Чиним правую ветку, если ее не существует
                if (!rBranch.length) {
                    freeBranch = rootBranches.not('.' + params.leftBranch);

                    if (freeBranch.length) {
                        freeBranch.addClass(params.rightBranch);
                    }
                    else {
                        if (rootBranches.length) {
                            rootBranches
                                .eq(0)
                                .removeClass(params.leftBranch)
                                .addClass(params.rightBranch)
                                .appendTo(params.root);
                        }
                        else {
                            return; // Нет ни одной ветки
                        }
                    }
                }

                // Чиним левую ветку, если ее не существует
                if (!lBranch.length) {
                    freeBranch = rootBranches.not('.' + params.rightBranch);

                    if (freeBranch.length) {
                        freeBranch.addClass(params.leftBranch);
                    }
                    else {
                        if (rootBranches.length) {
                            params.root.prepend( methods.getTemplate(0, 1) );
                            params.root
                                .children('.' + params.childrenClass)
                                .not('.' + params.rightBranch)
                                .addClass(params.leftBranch);
                        }
                        else {
                            return; // Нет ни одной ветки
                        }
                    }
                }

                lBranchChildren = lBranch.children();
                rBranchChildren = rBranch.children();

                sumHeight = rBranch.outerHeight() + lBranch.outerHeight();
                delta = 0.5 * sumHeight;

                for (var i = 0, rlen = rBranchChildren.length; i < rlen; i++) {
                    height += rBranchChildren.eq(i).outerHeight();
                    newDelta = Math.abs(0.5 * sumHeight - height);

                    if (delta >= newDelta) {
                        delta = newDelta;
                    }
                    else {
                        methods.moveNodes(1, i, rlen);

                        return;
                    }
                }

                for (var j = 0, llen = lBranchChildren.length; j < llen; j++) {
                    height += lBranchChildren.eq(j).outerHeight();
                    newDelta = Math.abs(0.5 * sumHeight - height);

                    if (delta >= newDelta) {
                        delta = newDelta;
                    }
                    else {
                        if (j > 0) {
                            methods.moveNodes(0, 0, j - 1);
                        }

                        return;
                    }
                }

                methods.clearEmptyBranches();
            }
        },

        moveNodes: function(rtl, from, to) {
            var collection,
                branchSource,
                branchTarget;

            branchSource = rtl ? $('.' + params.rightBranch) : $('.' + params.leftBranch);
            branchTarget = rtl ? $('.' + params.leftBranch) : $('.' + params.rightBranch);

            collection = branchSource.children();

            collection.each(function(i){
                if (i >= from && i <= to) {
                    $(this).appendTo(branchTarget);
                }
            });

            methods.clearEmptyBranches();
        },

        clearEmptyBranches: function() {
            var rootBranches = params.root.children('.' + params.childrenClass);

            rootBranches.each(function() {
                if ( !$(this).children().length ) {
                    $(this).remove();
                }
            });
        },

        getTemplate: function(withNode, withWrap) {
            var template = '';

            template += withWrap ? ' <ol class="' + params.childrenClass + '">' : '';
            template += withNode ? '<li class="' + params.childrenItemClass + '"><div class="' + params.nodeClass + '"><div class="' + params.nodeTextClass + '">Node</div><input class="' + params.nodeInputClass + '" type="text"></div></li> ' : '';
            template += withWrap ? '</ol>' : '';

            return template;
        },


        //save to localStorage
        saveLocal: function() {

        //remove activeClass before save
            $('.' + params.activeClass).removeClass(params.activeClass);
        
        //remove soearch classes
            $('.recolaps').css('display', 'none').removeClass('recolaps').addClass('collapsed');


            console.log('localStorage saved');
            $(".ui-sortable").removeClass("ui-sortable");
            $(".ui-sortable-handle").removeClass("ui-sortable-handle");
            $(".ui-droppable").removeClass('ui-droppable');


            var txt = $('.mindmap').html();

            localStorage.setItem('mindmap', txt);   

            $("ol").sortable({
                handle: ".node",
                connectWith: '.children',
                stop: function() {
                   methods.saveLocal();
                }
            }).disableSelection();

            $(".children").droppable({
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                accept: "li",
            });
        }
    };
   

   //when doc is ready
    $(document).ready(function() {

           var obj=document.body;  // obj=element for example body
                // bind mousewheel event on the mouseWheel function
                if(obj.addEventListener)
                {
                    obj.addEventListener('DOMMouseScroll',mouseWheel,false);
                    obj.addEventListener("mousewheel",mouseWheel,false);
                }
                else obj.onmousewheel=mouseWheel;



                function mouseWheel(e) {

                    var zoom = Math.round(parseFloat($('.mindmap').css('zoom')*100));
                    // disabling
                    e=e?e:window.event;
                    

                    if (e.wheelDelta > 0) {
                        if(zoom < 300)  zoom *= 1.2;
                    } else {
                        if(zoom > 50) zoom /= 1.2;
                    }

                    zoom = Math.round(zoom);
                    
                    $('.mindmap').css('zoom', zoom + '%');

                    if(e.preventDefault) e.preventDefault();
                    else e.returnValue=false;
                    return false;
                
                }

                //  google Auth 

                //when user load page and if he's auth
                //go in g drive and load file


                //when we should save data on disc
                // no so offen


        var txt = localStorage.getItem('mindmap'); 
        
        if(txt) {
            $('.mindmap').empty().append(txt);

            $('.node__text').css('opacity' , 1);
        }

            $("ol").sortable({
                handle: ".node",
                revert: true,           
                connectWith: '.children',
                stop: function() {
                    methods.saveLocal();
                }
            }).disableSelection();

            $(".children").droppable({
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                accept: "li",
            });

        $('.mindmap').draggable({
            scroll: false,
        });



        // If the menu element is clicked
        $(".custom-menu li").click(function(){
            var node = params.activeNode,
                prevNode,
                nextNode;
           
            // This is the triggered action name
            switch($(this).attr("data-action")) {
                
                // A case for each action. Your actions here
                case "delete": 

                    if (node.hasClass(params.editableClass)) {
                        return true;
                    }
                    else {
                        if (node.hasClass(params.rootClass)) {
                            return false;
                        }
                        nextNode = node.parent().next().children('.' + params.nodeClass);
                        parentNode = node.parent().parent().prev();

                        methods.removeNode();

                        if (nextNode.length) {
                            nextNode.addClass(params.activeClass);
                            params.activeNode = nextNode;
                        } else {
                            parentNode.addClass(params.activeClass);
                            params.activeNode = parentNode;
                        }
                    }

                break;
                case "second": console.log("second"); break;
                case "third": console.log("third"); break;
            }
          
            // Hide it AFTER the action was triggered 
            $(".custom-menu").hide(100);
          });

    });

    $('#search').focus(function() {
        methods.blur();

    });
    //search functionality 
    $('#search').on('input', function(){
        
        var find = $(this).val().toLowerCase();
            rows = $('.node__text');

        if (find.length <= 1) {

            $(rows).fadeTo('fast', 1);

            $('.recolaps').css('display', 'none').removeClass('recolaps').addClass('collapsed');

        }  

        if(find.length > 1){
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]).text().toLowerCase();       
                if( row.indexOf(find) == '-1' ) {
      
                    $(rows[i]).fadeTo( "fast" , 0.2 );

            } else {
           //is parrents have class collaps uncolaps
              
                var collapseds = $(rows[i]).closest('.collapsed');


                    collapseds.removeClass('collapsed').addClass('recolaps');
              
                 $(rows[i]).fadeTo( "fast" , 1 );
                
            }
        }
        console.log('-------------------------------');
        $('.recolaps').css('display', 'inline-block');

        }

    });



      $.fn.mindmap = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Unknown method: ' +  method );
        }

    };

    /*      
    $('.node').addClass(
        $(node).children('div').text().split(' ')[0]
                        );
                            c = c.replace('!', 'err');
                            c = c.replace('@', 'ni');
                            c = c.replace('#', 'nb');
                            c = c.replace('-', 'm');


                            $(node).addClass(
                                c
                                


                                );
    */

}(jQuery));


var email = localStorage.getItem('email');

// if valid
var news = false,
    clientId = '737859033100-5n24c2hdl1sak12taavbmak1c1667lbm.apps.googleusercontent.com',
    apiKey = 'AIzaSyDy3NduCSea7KbTdabDxRkWklCxK_dmJtY',
    scopes = 'https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}
function checkAuth() {
    if (email) {

        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
    } else {
        $('#gSignInWrapper').show();
    }
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) makeApiCall();

}

$('#customBtn').click(function() {
    news = true;

    handleAuthClick();
});

function handleAuthClick() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}

function makeApiCall() {
    // Step 4: Load the Google+ API
    gapi.client.load('plus', 'v1').then(function() {
        // Step 5: Assemble the API request
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
      // Step 6: Execute the API request
        request.then(function(resp) {
       
            if (resp.result.emails[0].value === email || news) {

                if (news) {

                    localStorage.setItem('email', resp.result.emails[0].value);
                    news = false;
                } 

                $('#gSignInWrapper').hide();

                $('#name').prepend('<span id="userName">' + resp.result.displayName + '</span>');
                $('#name').prepend('<img id="gUser" align="middle" src="'+  resp.result.image.url +'" />');
                
                $('#name').append('<a href="https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000">Logout</a>');


            loadDriveApi2();
            }

        }, function(reason) {
            clearInterval (autosave);
            $('#gSignInWrapper').show();
        console.log('Error: ' + reason.result.error.message);
        });
    });
}

var fileData = {};

function loadDriveApi() {
    gapi.client.load('drive', 'v2', writeToFile);

}

function writeToFile() {
    var request = gapi.client.drive.files.list({
        'maxResults': 10,
        'q' : 'trashed = false and title contains "mindmap"'
      });

    request.execute(function(resp) {

        var files = resp.items;

        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if(file.title === 'mindmap.html') {
                    //function to read the consist file
                    console.log('mindmap is already in');
                   
                   //write to file
                    fileData.folderId = file.parents[0].id;
                    fileData.fileId = file.id;

                    var mindmapData = localStorage.getItem('mindmap');

                    console.log('file id: ' + file.id + ' - updated');


                    up_createFile('PUT', fileData.fileId, fileData.folderId, mindmapData);


                   return false;
                } 
            
            }
        } else {
            console.log('No files found.');
        }
        
        ensureUploadFolderPresent();
        
    });
}

function ensureUploadFolderPresent(){
    return gapi.client.drive.files.list(
        {q:"mimeType = 'application/vnd.google-apps.folder' and trashed = false"}
    ).then(function(files){
        var directory=files.result.items;

            return createFolder().then(function(res){
                
                var mindmapData = localStorage.getItem('mindmap');
                fileData.folderId = res.result.id;
                console.log('folder created');
                
                //new function to create new file iser folder
                up_createFile('POST', '', fileData.folderId, mindmapData);
             
                return res.result;
            });
        
    });
}


function createFolder(){
    return gapi.client.drive.files.insert(
        {
            'resource':{
                "title":'mindmap',
                "mimeType": "application/vnd.google-apps.folder"
            }
        }
    );
}

 function up_createFile(method, fileId, folderId, text, callback) {

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var contentType = "text/html";
    var metadata = {
        'parents': [{"id": folderId}],
        'title': 'mindmap.html',
        'mimeType': contentType
    };   


    var multipartRequestBody =
        delimiter +  'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter + 'Content-Type: ' + contentType + '\r\n' + '\r\n' +
        text +
        close_delim;

    if (!callback) { callback = function(file) {  

        fileData.fielId = file.id;
        };
     }

    gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': method,
        'params': {'fileId': fileId, 'uploadType': 'multipart'},
        'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
        'body': multipartRequestBody,
        callback:callback,
    });
 }
    var mindmapData = localStorage.getItem('mindmap');

    function checkChenges() {

        var currentData = localStorage.getItem('mindmap');
            console.log('cheking');

        if (currentData !== mindmapData) {
            writeToFile();
            console.log('new data saved to Drive');
            mindmapData = localStorage.getItem('mindmap');
        } else {

            console.log('not need to chenges');
        }
    }

function loadDriveApi2() {
       gapi.client.load('drive', 'v2', printFile);

      }
      
function printFile() {
    var request = gapi.client.drive.files.list({
        'maxResults': 10,
        'q' : 'trashed = false and title contains "mindmap"'            
    });

    request.execute(function(resp) {
        console.log('Files:');

        //read hash from url and get ID
        var hash = window.location.hash;
        var fileId = hash.split('').slice(1,hash.length).join('');

        var files = resp.items;

        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                console.log(file.id + ' ' + file.title);

                if(file.id === fileId) {
                //function to read the consist file
                    downloadFile(file, function (res) {

                        console.log('loaded from drive');
                        $('.mindmap').empty().append(res);

                        $("ol").sortable({
                            revert: true,
                            handle: ".node",            
                            connectWith: '.children'
                        }).disableSelection();

                        $(".children").droppable({
                            activeClass: "ui-state-default",
                            hoverClass: "ui-state-hover",
                            accept: "li",
                        });

                        var autosave = setInterval(checkChenges, 30000 );

                    });
                    break;
                }  else {
                    // show cdefault file 
                }
            }
        } else {
            //save data first time then run autosave
            console.log('No files found.');
            writeToFile();  
            var autosave = setInterval(checkChenges, 30000 );
        }
    });
}
//read data from server!
function downloadFile(file, callback) {
    if (file.downloadUrl) {
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        
        xhr.onload = function() {
            callback(xhr.responseText);
        };

        xhr.onerror = function() {
            callback(null);
        };
        xhr.send();
    } else {
        callback(null);
    }
}