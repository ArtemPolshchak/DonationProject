$(document).ready(function () {
    $('#remove_server').click(function () { // клик по кнопке удаления сервера
        var servers_to_remove = []; // список серверов на удаление
        var servers_name_to_remove = []; // список названий серверов на удаление
        $('.server').each(function () { // проходимся по всем серверам
            if ($(this).find('.checkbox:checked').length > 0) { // если чекбокс активен
                servers_to_remove.push($('.servers .server').index($(this).find('.checkbox:checked').parents('.server'))); // добавляем сервер в список на удаление
                servers_name_to_remove.push($(this).find('.checkbox:checked').parents('.server').find('.title').text().trim()); // добавляем названия в список
            }
        });
        if (confirm("Вы уверены что хотите удалить " + servers_name_to_remove.join(", "))) { // окно подтверждения
            for (var i = 0; i < servers_to_remove.length; i++) { // проходимся по списку
                $('.servers .server:eq(' + servers_to_remove[i] + ')').remove(); // удаляем сервера
            }
        }
    });
    $('#settings_server').click(function () { // клик по кнопке настроек
        if ($('.server').find('.checkbox:checked').length > 1) { // если выбрано более 1 сервера
            alert("Выберите один сервер")
        } else if ($('.server').find('.checkbox:checked').length == 0) { // если не выбран сервер
            alert("Выберите сервер")
        } else {
            $('#settings.popup').fadeIn(250); // открываем окно настроек
        }
    });
    $('#add_server').click(function () { // клик по кнопке добавления нового сервера
        $('#addserver.popup').fadeIn(250); // открываем окно добавления сервера
    });
    $('.crest').click(function() { // клик по крестику
        $(this).parents('.popup').fadeOut(250); // закрываем окно настроек
    });
})