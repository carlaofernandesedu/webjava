[CmdletBinding()]
Param(
   [Parameter(Mandatory=$True,Position=0,HelpMessage="path do arquivo de configuracao")]
   [string]$configfile,
   
   [Parameter(Mandatory=$True,Position=1,HelpMessage="path do arquivo de parametros ou parametros por ;")]
   [string]$paramfile,

   [Parameter(Mandatory=$True,Position=2,HelpMessage="se 'true' Exibir os valores das chaves do arquivos de parametros")]
   [string]$showvalues

)

function Modify-ConfigFile($configfile, $paramfile, $bshowvalues) 
{

    try 
    {
        $option = [System.StringSplitOptions]::RemoveEmptyEntries
        $separador = '='
        $dicParam = @{}
        $dicParamString = @{}
        $doc = New-Object System.Xml.XmlDocument
         
        Write-Host 'Verificando a existencia do arquivo de configuracao' $configfile 
        if(Test-Path $configfile)
        {
            Write-Host 'Verificando a existencia do arquivo de parametros' $paramfile
            if(Test-Path $paramfile)
            {
              Write-Host 'Lendo o arquivo de parametros'
              foreach ($line in Get-Content $paramfile) 
              {
                if(![string]::IsNullOrWhiteSpace($line))
                {
                   $arrValor = $line.Split($separador,$option)
                   [string] $chave = $arrValor[0]
      
                   if($bshowvalues)
                   {
                     Write-Host 'Encontrado Chave:'$chave 'valor:'$arrValor[1]
                   }
                   else 
                   {
                     Write-Host 'Encontrado Chave:'$chave 'valor:xxxxx' 
                   }
                   if ($chave.IndexOf('$') -gt -1)
                   {
                     $dicParamString.add($chave,$arrValor[1])
                   }
                   else 
                   {
                     $dicParam.add($chave,$arrValor[1])
                   }
                }
              }
              Write-Host 'Lendo o arquivo de configuracao e carregando em memoria'
              $doc.Load($configfile) 
              foreach($key in $dicParam.keys)
              {
                    $node = $doc.SelectSingleNode('configuration/appSettings/add[@key="' + $key + '"]')
                    if($node)
                    {
                        if($bshowvalues)
                        {
                          Write-Host 'Atualizando o item appSettings -> chave' $key 'valor' $dicParam[$key]
                        }
                        else 
                        {
                          Write-Host 'Atualizando o item appSettings -> chave' $key 'valor *****'
                        }
 
                        $node.Attributes['value'].Value = $dicParam[$key]
                    }
                    else
                    {
                        Write-Host 'Chave' $key 'nao encontrada no appSettings'
                    }
              }
              Write-Host ""
              $nodesdb = $doc.SelectNodes('configuration/connectionStrings/add')
              foreach($nodedb in $nodesdb)
              {
                #if ($nodedb.HasAttributes)
                #{
                  [string] $condb = $nodedb.Attributes['connectionString'].Value
                  foreach($key in $dicParamString.keys)
                  {
                        [string] $newvalue = $dicParamString[$key]
                        if($condb.IndexOf($key) -gt 0)
                        {                   
                            Write-Host 'Atualizando o item connectionStrings -> chave' $key 
                            $condb = $condb.Replace($key, $newvalue)
                        }
                        else
                        {
                            Write-Host 'Chave' $key  ' nao encontrada no connectionStrings'
                        }
                  }
                  if ($bshowvalues) 
                  {
                    Write-Host "String Conexao Original: " $nodedb.Attributes['connectionString'].Value
                    Write-Host "String Conexao    Atual: " $condb 
                  }
                  $nodedb.Attributes['connectionString'].Value = $condb
                #}
              }
              Write-Host ""
              Write-Host 'Atualizando os valores modificados no arquivo fisico' $configfile
              $doc.Save($configfile)
              Write-Host 'Procedimento concluido arquivo atualizado'
              Exit 0
            }
            else 
            {
              Write-Host 'Nao encontrado arquivo de parametros' $paramfile
              Exit 1
              return  
            }           
            
        }
        else 
        {
            Write-Host 'Arquivo de configuracao nao encontrado' $configfile
            Exit 1 
            return 
        }
         
    }
    catch [Exception]
    {
        Write-Host 'ERRO NA EXECUCAO DO SCRIPT:' $_.Exception.Message
        exit 1 
        return 
    }
}

Function Convert-ParamBool($parameter) 
{
   if ($parameter -eq "true" -or $parameter -eq "false" -or $parameter -eq "True" -or $parameter -eq "False")
   {
      return [System.Convert]::ToBoolean($parameter)
   }
   else 
   {
     return $False
   }
}

 Write-Host "Arquivo de origem: " $configfile
 Write-Host "Arquivo de parametros: " $paramfile
 [boolean] $bshowvalues = Convert-ParamBool $showvalues 
 Write-Host "Exibir valores obtidos do arquivo param:" $bshowvalues 
 #[boolean] $bhascofigfile = Convert-ParamBool $hasconfigfile
 #Write-Host "Nao executar script se arquivo config nao existir:" $bhascofigfile
 Write-Host ""
 Modify-ConfigFile $configfile $paramfile $bshowvalues