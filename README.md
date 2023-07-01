# Whatsapp_bot_nodejs

Primeiramente você deve criar um banco de dados para o bot com id int auto_increment PRIMARY KEY, nome, Whatsapp, id_bot e
boas_vindas depois cadastrar o usuário com o endpoint POST Cadastro depois disso pegue o id do bot com o endpoint GET Token que vai
retorna-lo em seguida use o endpoint POST inicializar e coloque o id do bot como parâmetro ele irá começar o processo depois disso use o
endpoint GET status para acompanhar em seguida use o endpoind GET RequestQR com o id do banco de dados do prestador que você
deseja inicializar ele retornará o QRcode que deve ser escaneado pelo prestador então se tudo der certo o bot vai estar funcionado se não
use o endpoint GET status para acompanhar use o endpoint POST Enviar com o id do bot, whatsapp de quem vai receber e a mensagem. 
Você precisará usar o endpoint POST Resetar_dia todos os dias para que o bot possa reenviar as mensagens de boas-vindas.


Exemplo em Php:

    public static function criarPrestador($nome, $whatsapp, $boasVindas){
        $client = self::getClient();
        $url = self::getUrl('/Cadastro_do_prestador');
        $headers = [
            'Content-Type' => 'application/json',
        ];
        $body = json_encode([
            "nome" => $nome,
            "whatsapp" => preg_replace('/(\(|\)|\-|\s)/', '', $whatsapp),
            "boas_vindas" => $boasVindas
        ]);
        try{
            $response = $client->request('POST', $url, [
                'body' => $body,
                'headers' => $headers
            ]);
            $resposta = $response->getBody();
            $codigo = $response->getStatusCode();
        }catch (GuzzleException $e){
            $resposta = $e->getMessage();
            $codigo = $e->getCode();
        }


        if($codigo >= 200 AND $codigo < 300){
            return json_decode($resposta);
        }

        return false;
    }
