let colaboradorRef = db.collection('colaborador')

const exibirColaboradores = async(doc) => {
    console.log('exibirColaboradores')

    let colaboradores = colaboradorRef

    const data = await colaboradores.get()

    data.docs.forEach(doc => {
        const colaborador = doc.data()

        let item
    })
}

$(document).ready(function() {

    // Adicionar Colaborador
    $("#add-colaborador-form").submit(function(event) {
        event.preventDefault();

        let colaboradorNome = $('#colaborador-nome').val()
        let colaboradorEmail = $('#colaborador-email').val()
        let colaboradorEndereco = $('#colaborador-endereco').val()
        let colaboradorTelefone = $('#colaborador-telefone').val()

        db.collection('colaborador').add({
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
                  <td class="colaborador-nome">${colaboradorEmail}</td>
                  <td class="colaborador-nome">${colaboradorEndereco}</td>
                  <td class="colaborador-nome">${colaboradorTelefone}</td>
                  
                  <td>
                      <a href="#" id="${docRef.id} class="edit js-edit-colaborador"><i class="material-icons"  data-toggle="tooltip" title="Editar">&#xE254;</i>
                      </a>
                      <a href="#" id="${docRef.id} class="delete js-deletar-colaborador"><i class="material-icons" data-toggle="tooltip" title="Deletar">&#xE872;</i>
                  </td>
                 </tr>`;

                $('#colaborador-table tbody').prepend(novoColaborador)
            })
            .catch(function(error) {
                console.error("Erro ao escrever o documento: ", error)
            })
    })
})