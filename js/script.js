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


const exibirColaboradores = async(doc) => {
    console.log('exibirColaboradores');

    let colaboradores = colaboradorRef;
    console.log(colaboradores)

    const data = await colaboradores.get();
    console.log(data)

    data.docs.forEach(doc => {
        const colaborador = doc.data();
        console.log(colaborador)
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
							<a href="#" id="${doc.id}" class="edit js-edit-colaborador"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-delete-colaborador"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
					</td>
			</tr>`;

        $('#colaborador-tabela').append(item);
        console.log(item)

        // ACTIVATE TOOLTIP
        $('[data-toggle="tooltip"]').tooltip();

        // SELECT/DESELECT CHECKBOXES
        var checkbox = $('table tbody input[type="checkbox"]');
        $("#selecionarTodos").click(function() {
            if (this.checked) {
                checkbox.each(function() {
                    console.log(this.id);
                    deleteIDs.push(this.id);
                    this.checked = true;
                });
            } else {
                checkbox.each(function() {
                    this.checked = false;
                });
            }
        });
        checkbox.click(function() {
            if (!this.checked) {
                $("#selecionarTodos").prop("checked", false);
            }
        });
    })

    // UPDATE LATEST DOC
    latestDoc = data.docs[data.docs.length - 1];

    // UNATTACH EVENT LISTENERS IF NO MORE DOCS
    if (data.empty) {
        $('.js-loadmore').hide();
    }
}



$(document).ready(function() {

    let docRecente = null

    //carregar os dados iniciais
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
                      <a href="#" id="${docRef.id}" class="edit js-edit-colaborador"><i class="material-icons"  data-toggle="tooltip" title="Editar">&#xE254;</i>
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
})