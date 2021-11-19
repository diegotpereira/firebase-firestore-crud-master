let colaboradorRef = db.collection('colaboradores')

let deleteIDs = [];

// colaboradorRef.onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         if (change.type == 'added') {
//             console.log('added');
//         } else if (change.type == 'modified') {
//             console.log('modified');
//         } else if (change.type == 'removed') {
//             $('tr[data-id=' + change.doc.id + ']').remove();
//             console.log('removed');
//         }
//     });
// });

colaboradorRef.onSnapshot(snapshot => {
    let size = snapshot.size
    $('.contar').text(size)

    if (size == 0) {
        $('#selecionarTodos').attr('disabled', true)

    } else {
        $('#selecionarTodos').attr('disabled', false)
    }
})

// Tabela de Exibição de Colaboradores
const exibirColaboradores = async(doc) => {
    console.log('exibirColaboradores')

    let colaboradores = colaboradorRef;

    const data = await colaboradores.get()

    data.docs.forEach(doc => {
        const colaborador = doc.data();
        let item =
            `<tr data-id="${doc.id}">
					<td>
                        <span class="custom-checkbox">
                                <input type="checkbox" id="${doc.id}" nome="options[]" value="${doc.id}">
                                <label for="${doc.id}"></label>
                        </span>
					</td>
					<td class="colaborador-nome">${colaborador.nome}</td>
					<td class="colaborador-email">${colaborador.email}</td>
					<td class="colaborador-endereco">${colaborador.endereco}</td>
					<td class="colaborador-telefone">${colaborador.telefone}</td>
					<td>
							<a href="#" id="${doc.id}" class="edit js-editar-colaborador"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-deletar-colaborador"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
					</td>
			</tr>`;

        $('#colaborador-tabela').append(item);

        // // ACTIVATE TOOLTIP
        // $('[data-toggle="tooltip"]').tooltip();

        // // SELECT/DESELECT CHECKBOXES
        // var checkbox = $('table tbody input[type="checkbox"]');
        // $("#selecionarTodos").click(function() {
        //     if (this.checked) {
        //         checkbox.each(function() {
        //             console.log(this.id);
        //             deleteIDs.push(this.id);
        //             this.checked = true;
        //         });
        //     } else {
        //         checkbox.each(function() {
        //             this.checked = false;
        //         });
        //     }
        // });
        // checkbox.click(function() {
        //     if (!this.checked) {
        //         $("#selecionarTodos").prop("checked", false);
        //     }
        // });
    })

    // UPDATE LATEST DOC
    latestDoc = data.docs[data.docs.length - 1];

    // UNATTACH EVENT LISTENERS IF NO MORE DOCS
    if (data.empty) {
        $('.js-loadmore').hide();
    }
}

// Carregar Funções
$(document).ready(function() {

    let docRecente = null

    // Carregar os dados iniciais
    exibirColaboradores()

    $(document).on('click', '.js-loadmore', function() {
        exibirColaboradores(docRecente)
    })

    // Adicionar Colaborador
    $("#add-colaborador-form").submit(function(event) {
        event.preventDefault();

        let colaboradorNome = $('#colaborador-nome').val()
        let colaboradorEmail = $('#colaborador-email').val()
        let colaboradorEndereco = $('#colaborador-endereco').val()
        let colaboradorTelefone = $('#colaborador-telefone').val()

        db.collection('colaboradores').add({
                nome: colaboradorNome,
                email: colaboradorEmail,
                endereco: colaboradorEndereco,
                telefone: colaboradorTelefone,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(docRef) {
                console.log("Documento escrito com ID: ", docRef.id)
                $("#addColaboradorModal").modal('hide')

                let novoColaborador =
                    `<tr data-id="${docRef.id}">
                 <td>
                    <span class="custom-checkbox">
                       <input type="checkbox" id="${docRef.id}" name="option[]" value="${docRef.id}">
                       <label for="${docRef.id}"></label>
                    </span>
                  </td>
                  <td class="colaborador-nome">${colaboradorNome}</td>
                  <td class="colaborador-email">${colaboradorEmail}</td>
                  <td class="colaborador-endereco">${colaboradorEndereco}</td>
                  <td class="colaborador-telefone">${colaboradorTelefone}</td>
                  
                  <td>
                      <a href="#" id="${docRef.id}" class="edit js-editar-colaborador"><i class="material-icons"  data-toggle="tooltip" title="Editar">&#xE254;</i>
                      </a>
                      <a href="#" id="${docRef.id}" class="delete js-deletar-colaborador"><i class="material-icons" data-toggle="tooltip" title="Deletar">&#xE872;</i>
                      </a>
                  </td>
                 </tr>`;

                $('#colaborador-table tbody').prepend(novoColaborador)
            })
            .catch(function(error) {
                console.error("Erro ao escrever o documento: ", error)
            })
    })

    // Atualizar Colaborador
    $(document).on('click', '.js-editar-colaborador', function(event) {
        event.preventDefault()

        let id = $(this).attr('id')

        $('#editar-colaborador-form').attr('editar-id', id)
        db.collection('colaboradores').doc(id).get().then(function(document) {
                if (document.exists) {
                    $('#editar-colaborador-form #colaborador-nome').val(document.data().nome)
                    $('#editar-colaborador-form #colaborador-email').val(document.data().email)
                    $('#editar-colaborador-form #colaborador-endereco').val(document.data().endereco)
                    $('#editar-colaborador-form #colaborador-telefone').val(document.data().telefone)
                    $('#editarColaboradorModal').modal('show')

                } else {
                    console.log("Esse documento não existe!")
                }
            })
            .catch(function(error) {
                console.log("Erro ao obter o documento:", error)
            })
    })

    $("#editar-colaborador-form").submit(function(event) {
        event.preventDefault()

        let id = $(this).attr('editar-id')

        let colaboradorNome = $('#editar-colaborador-form #colaborador-nome').val()
        let colaboradorEmail = $('#editar-colaborador-form #colaborador-email').val()
        let colaboradorEndereco = $('#editar-colaborador-form #colaborador-endereco').val()
        let colaboradorTelefone = $('#editar-colaborador-form #colaborador-telefone').val()

        db.collection("colaboradores").doc(id).update({
            nome: colaboradorNome,
            email: colaboradorEmail,
            endereco: colaboradorEndereco,
            telefone: colaboradorTelefone,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        $('#editarColaboradorModal').modal('hide')

        // Exibir Dados Atualizados no Navegador
        $('tr[data-id=' + id + '] td.colaborador-nome').html(colaboradorNome)
        $('tr[data-id=' + id + '] td.colaborador-email').html(colaboradorEmail)
        $('tr[data-id=' + id + '] td.colaborador-endereco').html(colaboradorEndereco)
        $('tr[data-id=' + id + '] td.colaborador-telefone').html(colaboradorTelefone)
    })

    // Deletar Colaborador
    $(document).on('click', '.js-deletar-colaborador', function(event) {
        event.preventDefault()

        let id = $(this).attr('id')
        $('#deletar-colaborador-form').attr('deletar-id', id)
        $('#deletarColaboradorModal').modal('show')
    })

    $("#deletar-colaborador-form").submit(function(event) {
        event.preventDefault()

        let id = $(this).attr('deletar-id')

        if (id != undefined) {
            db.collection('colaboradores').doc(id).delete()
                .then(function() {
                    console.log("Documento Deletado com Sucesso!")
                    $("#deletarColaboradorModal").modal('hide')
                })
                .catch(function(error) {
                    console.log("Erro ao Deletar Documento: " + error)
                })
        } else {
            let checkbox = $('table tbody input:checked')
            checkbox.each(function() {
                db.collection('colaboradores').doc(this.value).delete()
                    .then(function() {
                        console.log("Documento Deletado com Sucesso!");
                        exibirColaboradores()
                    })
                    .catch(function(error) {
                        console.log("Erro ao Deletar Documento:" + error)
                    })
            })
            $("#deletarColaboradorModal").modal('hide')
        }
    })

    // Pesquisar por Nome
    $("#pesquisar-nome").on("keyup", function() {
        $('#colaborador-tabela tbody').html('')

        let palavraChave = $("#pesquisar-nome").val()
        console.log(palavraChave)
        colaboradorRef.orderBy('nome', 'asc').startAt(palavraChave).endAt(palavraChave + "\uf8ff").get()
            .then(function(documentSnapshots) {
                documentSnapshots.docs.forEach(doc => {
                    renderColaborador(doc)
                })

                // palavraChave = documentSnapshots.docs[documentSnapshots.docs.length - 1];
                // palavraChave = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            })
    })

    // Resetar Formulário
    $("#addColaboradorModal").on('hidden.bs.modal', function() {
        $('#add-colaborador-form .form-control').val('')
    })

    $("#editarColaboradorModal").on('hidden.bs.modal', function() {
        $('#editar-colaborador-form .form-control').val('')
    })
})